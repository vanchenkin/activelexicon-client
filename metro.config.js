// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add SVG support
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

// Configure asset handling for fonts and other resources
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

config.resolver.assetExts.push(
  // Adds support for `.ttf` files
  'ttf',
  // Adds support for `.otf` files
  'otf',
  'woff2'
);

module.exports = config;
