process.env.NODE_ENV = 'development';

const path = require('path');
const chalk = require('chalk');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const Dashboard = require

function start() {
    const app = express();
    const port = process.env.PORT || 8080;

    const compiler = webpack(webpackConfig);
    compiler.apply(new DashboardPlugin());

    const middleware = webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));

    const fs = middleware.fileSystem;
    app.get('*', function (req, res) {
        fs.readFile(path.join(compiler.outputPath, 'index.html'), function (err, file) {
            if (err) {
                console.error(chalk.red('Error serving file:') + ' ' + chalk.cyan(err));
                res.sendStatus(404);
            } else {
                res.send(file.toString());
            }
        });
    });

    app.listen(port, function (err) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('App started on ' + chalk.cyan('http://localhost:' + port));
    });
}

module.exports = start;
