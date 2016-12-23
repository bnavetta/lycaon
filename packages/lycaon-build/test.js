// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/scripts/test.js
process.env.NODE_ENV = 'test';

const fs = require('fs');
const jest = require('jest');
const path = require('path');
const paths = require('./paths');

function test() {
    const argv = process.argv.slice(2);

    if (!process.env.CI && argv.indexOf('--coverage') < 0) {
        argv.push('--watch');
    }

    const jestConfig = {
        collectCoverageFrom: ['src/**/*.{js,jsx}'],
        setupFiles: fs.existsSync(paths.testSetup) ? '<rootDir>/src/testSetup.js' : undefined,
        testPathIgnorePatterns: [
            '<rootDir>[/\\\\](dist|docs|node_modules)[/\\\\]'
        ],
        testEnvironment: 'node',
        testURL: 'http://localhost',
        moduleNameMapper: {
            '^.+\\.css$': require.resolve('identity-obj-proxy'),
        },
        transform: {
            '^.+\\.(js|jsx)$': require.resolve('./jest/babelTransform'),
            '^(?!.*\\.(js|jsx|css|json)$)': require.resolve('./jest/fileTransform'),
        },
        transformIgnorePatterns: [
            '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
        ],
        rootDir: paths.root
    };

    argv.push('--config', JSON.stringify(jestConfig));
    jest.run(argv);
}

module.exports = test;
