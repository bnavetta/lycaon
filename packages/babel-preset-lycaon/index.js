const presets = [
    require.resolve('babel-preset-react'),
    [require('babel-preset-env').default, {
        targets: process.env.NODE_ENV === 'test' ? { node: 'current' } : { browsers: ['last 2 versions', '> 1%', 'Firefox ESR'] }
        modules: false
    }],
    require.resolve('babel-preset-stage-0'),
];

const plugins = [
    require.resolve('react-hot-loader/babel'),
    // TODO: regenerator??
];

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    plugins.push(require.resolve('babel-plugin-transform-react-jsx-source'));
    plugins.push(require.resolve('babel-plugin-transform-react-jsx-self'));
}

if (process.env.NODE_ENV === 'test') {
    plugins.push(require.resolve('babel-plugin-transform-es2015-parameters'));
    plugins.push(require.resolve('transform-es2015-modules-commonjs'));
}

module.exports = {
    presets: presets,
    plugins: plugins,
}
