// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import * as tractorLogger from '@tractor/logger';
import * as path from 'path';

// Under test:
import { getConfig, loadConfig } from './load-config';

describe('@tractor/config-loader:', () => {
    describe('getConfig()', () => {
        it(`should throw if \`loadConfig()\` hasn't been called yet`, () => {
            expect(() => {
                getConfig();
            }).to.throw('You must call \`loadConfig()\` before you can use \`getConfig()\`!');
        });

        it('should return the previously loaded config', () => {
            sinon.stub(tractorLogger, 'info');

            const config = loadConfig(process.cwd(), './my.conf.js');
            const config2 = getConfig();

            expect(config).to.equal(config2);

            (tractorLogger.info as sinon.SinonStub).restore();
        });
    });

    describe('loadConfig():', () => {
        it('should use the passed in path to load the config', () => {
            sinon.spy(path, 'resolve');
            sinon.stub(tractorLogger, 'info');

            loadConfig(process.cwd(), './my.conf.js');

            expect(path.resolve).to.have.been.calledWith(process.cwd(), './my.conf.js');

            (path.resolve as sinon.SinonStub).restore();
            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should fall back to looking from "./tractor.conf.js"', () => {
            sinon.spy(path, 'resolve');
            sinon.stub(tractorLogger, 'info');

            loadConfig(process.cwd());

            expect(path.resolve).to.have.been.calledWith(process.cwd(), 'tractor.conf.js');

            (path.resolve as sinon.SinonStub).restore();
            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should load config values from a file', () => {
            sinon.stub(tractorLogger, 'info');

            const expectedPort = 5000;
            const expectedDirectory = './tests/e2e';

            const config = loadConfig(__dirname, '../fixtures/test.conf.js');

            expect(config.port).to.equal(expectedPort);
            expect(config.directory).to.equal(expectedDirectory);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should load config values from an ES2015 module', () => {
            sinon.stub(tractorLogger, 'info');

            const expectedPort = 5000;
            const expectedDirectory = './tests/e2e';

            const config = loadConfig(__dirname, '../fixtures/test.esm.conf.ts');

            expect(config.port).to.equal(expectedPort);
            expect(config.directory).to.equal(expectedDirectory);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should load any missing values from the default config', () => {
            sinon.stub(tractorLogger, 'info');

            const defaultPort = 4000;
            const defaultDirectory = './tractor';
            const defaultEnvironments = ['http://localhost:8080'];

            const config = loadConfig(__dirname, '../fixtures/empty.conf.js');

            expect(config.port).to.equal(defaultPort);
            expect(config.directory).to.equal(defaultDirectory);
            expect(config.environments).to.deep.equal(defaultEnvironments);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should have a default `afterProtractor()` function', () => {
            sinon.stub(tractorLogger, 'info');

            const config = loadConfig(__dirname, '../fixtures/empty.conf.js');

            expect(config.afterProtractor).to.not.equal(undefined);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should have a default `beforeProtractor()` function', () => {
            sinon.stub(tractorLogger, 'info');

            const config = loadConfig(__dirname, '../fixtures/empty.conf.js');

            expect(config.beforeProtractor).to.not.equal(undefined);

            (tractorLogger.info as sinon.SinonStub).restore();
        });
    });
});
