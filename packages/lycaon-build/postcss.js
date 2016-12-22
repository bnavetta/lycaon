const postcss = require('postcss');

module.exports = postcss.plugin('lycaon', function(options) {
    const processor = postcss();

    processor.use(require('autoprefixer'), {
        browsers: ['last 2 versions', '> 1%']
    });

    processor.use(require('postcss-flexbugs-fixes'));

    processor.use(require('postcss-reporter'));

    processor.use(require('postcss-browser-reporter'));

    return processor;
});
