/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import fs from 'graceful-fs';
import path from 'path';
import * as tractorLogger from 'tractor-logger';

// Under test:
import createBaseTestFiles from './create-base-test-files';

describe('tractor - init/create-base-test-files:', () => {
    it('should copy the "world.js" file to the "support" folder in the users specified directory', () => {
        sinon.stub(fs, 'openAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(fs, 'readFileAsync').returns(Promise.resolve('world'));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return createBaseTestFiles.run('')
        .then(() => {
            expect(fs.readFileAsync).to.have.been.calledWith(path.join(__dirname, '/base-file-sources/world.js'));
            expect(fs.writeFileAsync).to.have.been.calledWith(path.join(process.cwd(), '/support/world.js'), 'world');
        })
        .finally(() => {
            fs.openAsync.restore();
            fs.readFileAsync.restore();
            fs.writeFileAsync.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if "world.js" already exists', () => {
        sinon.stub(fs, 'openAsync').returns(Promise.resolve(''));
        sinon.stub(tractorLogger, 'warn');

        return createBaseTestFiles.run('')
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"world.js" already exists. Not copying...');
        })
        .finally(() => {
            fs.openAsync.restore();
            tractorLogger.warn.restore();
        });
    });

    it('should copy the "protractor.conf.js" file to the users specified directory', () => {
        sinon.stub(fs, 'openAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(fs, 'readFileAsync').returns(Promise.resolve('config'));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return createBaseTestFiles.run('')
        .then(() => {
            expect(fs.readFileAsync).to.have.been.calledWith(path.join(__dirname, '/base-file-sources/protractor.conf.js'));
            expect(fs.writeFileAsync).to.have.been.calledWith(path.join(process.cwd(), '/protractor.conf.js'), 'config');
        })
        .finally(() => {
            fs.openAsync.restore();
            fs.readFileAsync.restore();
            fs.writeFileAsync.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if "protractor.conf.js" already exists', () => {
        sinon.stub(fs, 'openAsync').returns(Promise.resolve(''));
        sinon.stub(tractorLogger, 'warn');

        return createBaseTestFiles.run('')
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"protractor.conf.js" already exists. Not copying...');
        })
        .finally(() => {
            fs.openAsync.restore();
            tractorLogger.warn.restore();
        });
    });

    it('should copy the "hooks.js" file to the "support" folder in the users specified directory', () => {
        sinon.stub(fs, 'openAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(fs, 'readFileAsync').returns(Promise.resolve('hooks'));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return createBaseTestFiles.run('')
        .then(() => {
            expect(fs.readFileAsync).to.have.been.calledWith(path.join(__dirname, '/base-file-sources/hooks.js'));
            expect(fs.writeFileAsync).to.have.been.calledWith(path.join(process.cwd(), '/support/hooks.js'), 'hooks');
        })
        .finally(() => {
            fs.openAsync.restore();
            fs.readFileAsync.restore();
            fs.writeFileAsync.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if "hooks.js" already exists', () => {
        sinon.stub(fs, 'openAsync').returns(Promise.resolve(''));
        sinon.stub(tractorLogger, 'warn');

        return createBaseTestFiles.run('')
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"hooks.js" already exists. Not copying...');
        })
        .finally(() => {
            fs.openAsync.restore();
            tractorLogger.warn.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(fs, 'openAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(fs, 'readFileAsync').returns(Promise.resolve(''));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return createBaseTestFiles.run('')
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Creating "world.js"...');
            expect(tractorLogger.info).to.have.been.calledWith('Creating "protractor.conf.js"...');
            expect(tractorLogger.info).to.have.been.calledWith('Creating "hooks.js"...');
            expect(tractorLogger.info).to.have.been.calledWith('"world.js" created.');
            expect(tractorLogger.info).to.have.been.calledWith('"protractor.conf.js" created.');
            expect(tractorLogger.info).to.have.been.calledWith('"hooks.js" created.');
        })
        .finally(() => {
            fs.openAsync.restore();
            fs.readFileAsync.restore();
            fs.writeFileAsync.restore();
            tractorLogger.info.restore();
        });
    });
});
