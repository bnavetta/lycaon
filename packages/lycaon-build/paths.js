const path = require('path');
const fs = require('fs');

const rootDirectory = fs.realpathSync(process.cwd());

function resolve(relativePath) {
    return path.resolve(rootDirectory, relativePath);
}

module.exports = {
    root: rootDirectory,
    dist: resolve('dist'),
    src: resolve('src'),
    config: resolve('lycaon.config.js'),
    entryFile: resolve('src/index.jsx'),
    htmlTemplate: resolve('src/index.html'),
    testSetup: resolve('src/testSetup.js'),
    nodeModules: resolve('node_modules'),
    ownNodeModules: path.resolve(__dirname, 'node_modules')
};
