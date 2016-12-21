module.exports = {
    presets: [
        require.resolve('babel-preset-react'),
        [require('babel-preset-env').default, {
            targets: {
                browsers: ['last 2 versions', '> 1%']
            },
            modules: false
        }],
        require.resolve('stage-0'),
    ]
    plugins: [
        require.resolve('react-hot-loader/babel'),
        // TODO: regenerator??
    ],
    env: {
        development: {
            plugins: [
                require.resolve('babel-plugin-transform-react-jsx-source'),
                require.resolve('babel-plugin-transform-react-jsx-self'),
            ]
        },
        test: {
            presets: [
                [require('babel-preset-env').default, {
                    targets: {
                        node: 'current',
                    },
                }],
            ],
            plugins: [
                require.resolve('babel-plugin-transform-es2015-parameters')
                require.resolve('babel-plugin-transform-react-jsx-source'),
                require.resolve('babel-plugin-transform-react-jsx-self'),
            ]
        },
    }
}
