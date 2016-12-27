module.exports = {
    extends: require.resolve('stylelint-config-standard'),

    rules: {
        // Indentation
        "indentation": 4,

        // Quotes
        'font-family-name-quotes': 'always-where-recommended',
        'function-url-quotes': 'always',
        'selector-attribute-quotes': 'always',
        'string-quotes': 'single',

        // Property order
        // Similar to https://github.com/twitter/recess/blob/master/lib/lint/strict-property-order.js#L36
        'declaration-block-properties-order': [[
            // Positioning
            'position',
            'top',
            'bottom',
            'left',
            'right',
            'z-index',

            // Display
            'display',
            'float',
            'width',
            'height',
            'max-width',
            'max-height',
            'min-width',
            'min-height',
            'padding',
            'margin',
            'overflow',
            'flex',
            'justify-content',
            'align-items',

            // Typography
            'font',
            'line-height',
            'letter-spacing',
            'word-spacing',

            // Visual
            'color',
            'text',
            'word',
            'white-space',
            'vertical-align',
            'list',
            'pointer-events',
            'cursor',
            'background',
            'border',
            'content',
            'quotes',
            'outline',
            'opacity',
            'visibility',
            'transform',
            'animation',
            'transition'
        ], { unspecified: "bottomAlphabetical" }],

        // Don't use vendor prefixes since autoprefixer handles that
        'at-rule-no-vendor-prefix': true,
        'media-feature-name-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
    },
};
