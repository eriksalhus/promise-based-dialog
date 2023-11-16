import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    postcssPresetEnv({
      stage: 0,
      features: {
        'logical-properties-and-values': false,
        'prefers-color-scheme-query': false,
        'gap-properties': false,
        'custom-properties': false,
        'dir-pseudo-class': false,
        'is-pseudo-class': false,
        'focus-within-pseudo-class': false,
        'focus-visible-pseudo-class': false,
        'color-functional-notation': false,
      },
    }),
  ],
};
