module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Path aliases for clean imports
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@atoms':        './src/components/atoms',
            '@molecules':    './src/components/molecules',
            '@organisms':    './src/components/organisms',
            '@templates':    './src/components/templates',
            '@hooks':        './src/hooks',
            '@store':        './src/store',
            '@services':     './src/services',
            '@repositories': './src/repositories',
            '@types':        './src/types',
            '@utils':        './src/utils',
            '@constants':    './src/constants',
            '@assets':       './assets',
          },
        },
      ],
    ],
  };
};
