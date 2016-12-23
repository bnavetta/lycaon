const fs = require('fs');
const paths = require('./paths');
const mergeWith = require('lodash/mergeWith');

const defaults = {
    entry: {
        main: paths.entryFile,
    },
    // customizeWebpack: (webpackConfig) => webpackConfig
};

if (fs.existsSync(paths.config)) {
    const config = require(paths.config);

    // https://github.com/babel/babel/blob/master/packages/babel-core/src/helpers/merge.js
    module.exports = mergeWith({}, defaults, config, function (a, b) {
        if (b && Array.isArray(a)) {
            let newArray = b.slice(0);
            for (let item of a) {
                if (newArray.indexOf(item) < 0) {
                    newArray.push(item);
                }
            }
        }

        return newArray
    });
} else {
    module.exports = defaults;
}
