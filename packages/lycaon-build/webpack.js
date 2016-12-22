const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FlowStatusWebpackPlugin = require('flow-status-webpack-plugin');

const paths = require('./paths');

const isProd = process.env.NODE_ENV === 'production';

function cssLoader() {
    if (isProd) {
        return ExtractTextPlugin.extract({
            fallback: 'style-loader',
            loader: [
                {
                    loader: 'css-loader',
                    options: {
                        localIdentName: '[hash:base64:16]',
                        modules: true,
                        importLoaders: 1
                    },
                },
                { loader: 'postcss-loader' }
            ]
        });
    } else {
        return [
            { loader: 'style-loader' },
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    sourceMap: true,
                    localIdentName: '[local]__[path][name]',
                    importLoaders: 1,
                },
            },
            { loader: 'postcss-loader' },
        ];
    }
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
            new ManifestPlugin({
                filename: 'asset-manifest.json',
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

    entry: entry(),
    output: output(),

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: { loader: 'eslint-loader' },
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

            {
                test: /\.css$/,
                loader: cssLoader(),
            },

            {
                test: /\.json$/,
                use: { loader: 'json-loadder' },
            },

            {
                exclude: [
                    /\.html$/,
                    /\.jsx?$/,
                    /\.css$/,
                    /\.json$/,
                ],
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[path][name].[hash:32].[ext]'
                    },
                },
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [paths.src, paths.nodeModules]
    },

    resolveLoader: {
        modules: [paths.ownNodeModules, paths.nodeModules],
    },

    plugins: [
        new StyleLintPlugin(),
        new FlowStatusWebpackPlugin({
            failOnError: isProd,
            onError: function (stdout) {
                if (!isProd) { // failOnError logs it anyways
                    console.log(stdout);
                }
            },
        }),
        new HtmlWebpackPlugin(htmlPlugin()),
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
