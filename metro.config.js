const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const path = require('path');

const config = {
  watchFolders: [
    path.resolve(__dirname, '../vendor-platform/packages/ui-library'),
    path.resolve(__dirname, '../vendor-platform/packages/shared-types'),
    path.resolve(__dirname, '../vendor-platform/node_modules'),
  ],
  server: {
    port: 8081,
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);