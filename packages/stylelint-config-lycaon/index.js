module.exports = {
    extends: require.resolve('stylelint-config-standard'),

    rules: {
        // Quotes
        'font-family-name-quotes': 'always-where-recommended',
        'function-url-quotes': 'always',
        'selector-attribute-quotes': 'always',
        'string-quotes': 'single',

        // Property order
        'declaration-block-properties-order': [[
            'padding',
            'margin',
            'border',
            'font',
            'color',
            'background',
            'transform',
        ], { unspecified: "bottomAlphabetical" }],

        // Don't use vendor prefixes since autoprefixer handles that
        'at-rule-no-vendor-prefix': true,
        'media-feature-name-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
    },
};
