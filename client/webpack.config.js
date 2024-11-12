const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = {
  webpack: (config, env) => {
    config.resolve.fallback = {
      url: false,
    };
    return config;
  },
  resolve: {
    // ... rest of the resolve config
    fallback: {
      https: false,
      http: false,
      zlib: false,
    },
  },
  plugins: [new NodePolyfillPlugin()],
};