process.env.NODE_ENV = 'production';

const path = require('path');
const paths = require('./paths');
process.env.NODE_PATH = paths.ownNodeModules + path.delimiter + process.env.NODE_PATH;

const chalk = require('chalk');
const del = require('del');
const fs = require('fs-extra');
const ProgressBar = require('progress');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

const webpackConfig = require('./webpack');

// From create-react-app
function printErrors(summary, errors) {
    console.log(chalk.red(summary));
    console.log();
    errors.forEach(function (err) {
        console.log(err.message || err);
        console.log();
    });
}

function build() {
    del.sync([paths.dist]);

    const compiler = webpack(webpackConfig);

    const bar = new ProgressBar(':bar :percent ' + chalk.green(':message') + ' :etas', {
        total: 100,
        complete: '█',
        incomplete: '░',
    });
    let lastProgress = 0;
    compiler.apply(new ProgressPlugin({
        handler: function (percentage, message) {
            const delta = percentage - lastProgress;
            lastProgress = percentage;
            bar.tick(delta * 100, { message: message });
        },
        profile: false,
    }));

    compiler.run(function (err, stats) {
        if (err) {
            printErrors('Failed to compile.', [err]);
            process.exit(1);
        }

        if (stats.compilation.errors.length > 0) {
            printErrors('Compilation errors.', stats.compilation.errors);

            process.exit(1);
        }

        if (stats.compilation.warnings.length > 0) {
            printErrors('Compilation warnings.', stats.compilation.warnings);
        }

        console.log(stats.toString({
            modules: true,
            exclude: ['node_modules'],
            colors: require('supports-color')
        }));

        fs.outputJsonSync(path.join(paths.dist, 'stats.json'), stats.toJson());

        console.log(chalk.green('Compiled successfully.'));
    });
}

module.exports = build;
