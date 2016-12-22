module.exports = {
    extends: ['airbnb'],

    env: {
        browser: true,
        commonjs: true,
        es6: true,
        'shared-node-browser': true,
    },

    plugins: [
        'flowtype',
        'import',
        'jsx-a11y',
        'react',
        'unicorn',
    ],

    parser: 'babel-eslint',

    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            generators: true,
            experimentalObjectRestSpread: true,
        }
    },

    rules: {
        indent: ['error', 4, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            FunctionDeclaration: {
                parameters: 1,
                body: 1,
            },
            FunctionExpression: {
                parameters: 1,
                body: 1,
            },
        }],

        'react/jsx-indent': ['error', 4],

        'import/no-nodejs-modules': 'error',

        'unicorn/explicit-length-check': 'error',
        // No setting for filename-case so React components can be PascalCase and others can be kebab-case
        // Neither feels right for all situations
        'unicorn/no-abusive-eslint-disable': 'error',
        'unicorn/no-process-exit': 'error',
        'unicorn/throw-new-error': 'error',
        // Some not published yet
        // 'unicorn/number-literal-case': 'error',
        // 'unicorn/escape-case': 'error',
        // 'unicorn/no-array-instanceof': 'error',
        // 'unicorn/no-new-buffer': 'error',
        // 'unicorn/no-hex-escape': 'error',
        // 'unicorn/custom-error-definition': 'error',

        'flowtype/boolean-style': 'error',
        'flowtype/delimiter-dangle': ['error', 'always-multiline'],
        'flowtype/define-flow-type': 'warn',
        'flowtype/require-valid-file-annotation': ['error', 'always'],
        'flowtype/require-parameter-type': ['warn', { excludeArrowFunctions: true }],
        'flowtype/require-return-type': ['warn', { excludeArrowFunctions: true }],
        'flowtype/use-flow-type': 'warn'
    },
};
