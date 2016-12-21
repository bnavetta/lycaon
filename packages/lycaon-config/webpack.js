const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const StyleLintPlugin = requirE('stylelint-webpack-plugin');

const paths = require('./paths');

const isProd = process.env.NODE_ENV === 'production';

function cssLoader() {
    if (isProd) {
        return ExtractTextPlugin.extract({
            notExtractLoader: 'style-loader',
            loader: 'css-loader?localIdentName=[hash:base64:16]&modules&importLoaders=1!postcss-loader'
        });
    } else {
        return 'style-loader!css-loader?importLoaders=1&modules&sourceMap&localIdentName=[local]__[path][name]!postcss-loader';
    }
}

function plugins() {
    if (isProd) {
        return [
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.optimize.DedupePlugin(),
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
            new ManifestPlugin({
                filename: 'asset-manifest.json',
            }),
        ]
    } else {
        return [
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ];
    }
}

function htmlPlugin() {
    if (isProd) {
        return {
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
        }
    } else {
        return {
            inject: true,
            template: paths.htmlTemplate
        }
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
        output.publicPath = '/';
    }

    return output;
}

function entry() {
    if (isProd) {
        return [paths.entryFile];
    } else {
        return [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client',
            paths.entryFile,
        ];
    }
}

module.exports = {
    context: paths.root,

    bail: isProd,
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',

    output: output(),

    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                include: paths.src,
            }
        ],

        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: paths.src,
                query: {
                    cacheDirectory: true,
                }
            },

            {
                test: /\.css$/,
                loader: cssLoader(),
            },

            {
                test: /\.json$/,
                loader: 'json-loadder'
            },

            {
                exclude: [
                    /\.html$/,
                    /\.jsx?$/,
                    /\.css$/,
                    /\.json$/,
                ],
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: '[path][name].[hash:32].[ext]'
                }
            }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx', '.json'],
        modules: [paths.src, paths.nodeModules]
    },

    plugins: [
        new StyleLintPlugin(),
        new HtmlWebpackPlugin(htmlPlugin()),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: isProd,
            debug: !isProd,
        }),
    ].concat(plugins()),

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
}
