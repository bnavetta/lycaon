const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FlowStatusWebpackPlugin = require('flow-status-webpack-plugin');
const _ = require('lodash');

const paths = require('./paths');
const config = require('./config');
const AssetManifestPlugin = require('./AssetManifestPlugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

function cssLoader(loaders) {
    if (isProd) {
        return ExtractTextPlugin.extract({
            fallback: 'style-loader',
            loader: [
                {
                    loader: 'css-loader',
                    query: {
                        localIdentName: '[hash:base64:16]',
                        modules: config.features.cssModules,
                        importLoaders: loaders.length
                    },
                }
            ].concat(loaders)
        });
    } else {
        return [
            { loader: 'style-loader' },
            {
                loader: 'css-loader',
                query: {
                    modules: config.features.cssModules,
                    sourceMap: true,
                    localIdentName: '[local]__[path][name]',
                    importLoaders: loaders.lengtn,
                },
            }
        ].concat(loaders);
    }
}

function sassRule() {
    if (!config.features.sass) {
        return undefined;
    }

    return {
        test: /\.scss$/,
        loader: cssLoader([
            { loader: 'postcss-loader' },
            { loader: 'resolve-url-loader' },
            {
                loader: 'sass-loader',
                query: {
                    sourceMap: true,
                    includePaths: [paths.src]
                }
            }
        ]),
        exclude: /node_modules/
    };
}

function cssRule() {
    return {
        test: /\.css$/,
        loader: cssLoader([{ loader: 'postcss-loader' }])
    };
}

function plugins() {
    if (isProd) {
        return [
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    screw_ie8: true,
                    warnings: false,
                },
                mangle: {
                    screw_ie8: true,
                },
                output: {
                    screw_ie8: true,
                    comments: false,
                }
            }),
            new ExtractTextPlugin({
                filename: '[name].[contenthash].css',
                disable: false,
                allChunks: true,
            }),
            new webpack.NoErrorsPlugin(),
        ]
    } else {
        return [
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ];
    }
}

function htmlPlugin() {
    if (!fs.existsSync(paths.htmlTemplate)) {
        return undefined;
    }
    else if (isProd) {
        return new HtmlWebpackPlugin({
            inject: true,
            template: paths.htmlTemplate,
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        });
    } else {
        return new HtmlWebpackPlugin({
            inject: true,
            template: paths.htmlTemplate
        });
    }
}

function output() {
    const output = {
        path: paths.dist,
        pathinfo: true,
    };

    if (isProd) {
        output.filename = '[name].[chunkhash].js';
        output.chunkFilename = '[name].[chunkhash].chunk.js';
    } else {
        output.filename = '[name].js';
        output.chunkFilename = '[name].chunk.js';
        output.publicPath = 'http://localhost:' + (process.env.PORT || '8080') + '/';
    }

    return output;
}

function entry() {
    let entryBase = [];
    if (isDev) {
        entryBase.push(
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=http://localhost:' + (process.env.PORT || '8080') + '/__webpack_hmr'
        )
    }

    return _.mapValues(config.entry, function (entry) {
        return _.concat(entryBase, entry);
    });
}

const baseConfig = {
    context: paths.root,

    bail: isProd,
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',

    entry: entry(),
    output: output(),

    module: {
        rules: _.compact([
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'eslint-loader',
                    query: {
                        failOnError: isProd,
                    }
                },
                include: paths.src,
                enforce: 'pre',
            },

            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: 'lycaon',
                        cacheDirectory: true,
                    },
                },
                include: paths.src,
            },

            cssRule(),
            sassRule(),

            {
                test: /\.json$/,
                use: { loader: 'json-loader' },
            },

            {
                exclude: [
                    /\.html$/,
                    /\.jsx?$/,
                    /\.css$/,
                    /\.json$/,
                    /\.scss$/,
                ],
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[path][name].[hash:32].[ext]'
                    },
                },
            }
        ])
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [paths.src, paths.nodeModules]
    },

    resolveLoader: {
        modules: [paths.ownNodeModules, paths.nodeModules],
    },

    plugins: _.compact([
        new StyleLintPlugin(),
        new FlowStatusWebpackPlugin({
            failOnError: isProd,
            onError: function (stdout) {
                if (!isProd) { // failOnError logs it anyways
                    console.log(stdout);
                }
            },
        }),
        htmlPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new AssetManifestPlugin({
            emitToFile: isDev,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: isProd,
            debug: !isProd,
            options: {
                context: paths.root,
                output: {
                    path: paths.dist
                }
            }
        }),
    ]).concat(plugins()),

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};

if (config.customizeWebpack) {
    module.exports = config.customizeWebpack(baseConfig);
} else {
    module.exports = baseConfig;
}
