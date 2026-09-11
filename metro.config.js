const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);
const nativewindRoot = path.dirname(require.resolve('nativewind/package.json'));
const cssInteropRoot = path.dirname(
  require.resolve('react-native-css-interop/package.json', { paths: [nativewindRoot] }),
);

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    'react-native-css-interop': cssInteropRoot,
  },
};

module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
});
