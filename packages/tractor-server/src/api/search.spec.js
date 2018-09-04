// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { File, FileStructure } from '@tractor/file-structure';
import path from 'path';

// Under test:
import { searchHandler } from './search';

describe('@tractor/server - api: search', () => {
    it('should respond with no results initially', () => {
        let request = {};
        let response = {
            send: () => {}
        };

        sinon.stub(response, 'send');

        searchHandler()(request, response);

        expect(response.send).to.have.been.calledWith({
            count: 0,
            results: []
        });
    });

    // TODO: These tests are impossible to right because of the current DI setup...
    // debounce needs to be an injectable thing.
    it.skip('should return search results after some Files have been processed', async () => {
        let request = {
            query: 'file'
        };
        let response = {
            send: () => {}
        };
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
        let file = new File(filePath, fileStructure);

        sinon.stub(File.prototype, 'read').resolves(null);
        sinon.stub(response, 'send');

        let handler = searchHandler();

        await file.read();
        handler(request, response);
        expect(response.send).to.have.been.calledWith({
            count: 1,
            results: [file.toJSON()]
        });

        File.prototype.read.restore();
    });

    it('should reindex whenever a File is saved');

    it('should reindex whenever a File is deleted');
});
