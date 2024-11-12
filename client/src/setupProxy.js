const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: 'https://devmatch-3t9l.onrender.com',
      changeOrigin: true,
    })
  );
};