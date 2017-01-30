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
import childProcess from 'child_process';
import path from 'path';
import * as tractorLogger from 'tractor-logger';

// Under test:
import setUpSelenium from './set-up-selenium';

describe('tractor - init/set-up-selenium:', () => {
    it('should run the "webdriver-manager update" command', () => {
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return setUpSelenium.run()
        .then(() => {
            let webdriverManagerPath = path.join('node_modules', 'protractor', 'bin', 'webdriver-manager');
            expect(childProcess.execAsync).to.have.been.calledWith(`node ${webdriverManagerPath} update`);
        })
        .finally(() => {
            childProcess.execAsync.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return setUpSelenium.run()
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Setting up Selenium...');
            expect(tractorLogger.info).to.have.been.calledWith('Selenium setup complete.');
        })
        .finally(() => {
            childProcess.execAsync.restore();
            tractorLogger.info.restore();
        });
    });
});
