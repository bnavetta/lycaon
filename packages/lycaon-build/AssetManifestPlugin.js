/*
 * Combination of
 * https://github.com/FormidableLabs/webpack-stats-plugin
 * and
 * https://github.com/danethurber/webpack-manifest-plugin
 */

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

function AssetManifestPlugin(opts) {
    this.options = _.assign({
        filename: 'asset-manifest.json',
        emitToFile: false // write to disk when using in-memory fs for webpack dev server
    }, opts || {});
}

AssetManifestPlugin.prototype.apply = function(compiler) {
    compiler.plugin('emit', function(compilation, callback) {
        const manifest = compilation.chunks.reduce(function (manifest, chunk) {
            manifest[chunk.name] = chunk.files.reduce(function (chunkAssets, file) {
                if (file.indexOf('hot-update') > 0) {
                    // Don't include hot-update files
                    return chunkAssets;
                }

                let fileType = path.extname(file);
                if (fileType.length > 0){
                    fileType = fileType.substring(1); // remove dot
                }

                if (fileType !== 'map') {
                    chunkAssets[fileType] = chunkAssets[fileType] || [];
                    chunkAssets[fileType].push(file);
                }

                return chunkAssets;
            }, {});
            return manifest;
        }, {});

        const json = JSON.stringify(manifest, null, 4);

        compilation.assets[this.options.filename] = {
            source: function() {
                return json;
            },
            size: function() {
                return json.length;
            }
        };

        if (this.options.emitToFile) {
            const outputFile = path.join(compilation.options.output.path, this.options.filename);
            fs.outputFile(outputFile, json, callback);
        } else {
            callback();
        }
    }.bind(this));
};

module.exports = AssetManifestPlugin;
