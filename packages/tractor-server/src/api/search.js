// Dependencies:
import { File } from '@tractor/file-structure';
import { Search, StemmingTokenizer } from 'js-search';
import debounce from 'lodash.debounce';
import monkeypatch from 'monkeypatch';
import { stemmer } from 'porter-stemmer';

// Constants:
const INDEX_DEBOUNCE_TIME = 1000;

// TODO: This could be rethought... It isn't a particularly elegant method of
// hooking into the file structure, but it is quite effective? It is proving
// quite tricky to test.
export function searchHandler () {
    const FILES = [];

    let search = null;
    let indexFiles = debounce(() => search = createSearchIndex(FILES), INDEX_DEBOUNCE_TIME);

    monkeypatchFile('read', function (original, ...args) {
        return original.apply(this, args)
        .then(result => {
            console.log(this.basename);
            FILES.push(this);
            indexFiles();
            return result;
        });
    });

    monkeypatchFile('delete', function (original, ...args) {
        return original.apply(this, args)
        .then(result => {
            if (FILES.includes(this)) {
                FILES.splice(FILES.indexOf(this), 1);
            }
            indexFiles();
            return result;
        });
    });

    monkeypatchFile('save', function (original, ...args) {
        return original.apply(this, args)
        .then(result => {
            indexFiles();
            return result;
        });
    });

    return function (request, response) {
        console.log(search);
        let results = search ? search.search(request.query.searchString) : [];
        results = results.map(result => result.toJSON());
        response.send({ results });
    }
}

function createSearchIndex (files) {
    let search = new Search('path');
    search.tokenizer = new StemmingTokenizer(stemmer, search.tokenizer);
    search.addIndex('basename');
    search.addIndex('content');
    search.addDocuments(files);
    return search;
}

function monkeypatchFile (name, patch) {
    if (File.prototype[name].unpatch) {
        File.prototype[name].unpatch();
    }
    monkeypatch(File.prototype, name, patch);
}
