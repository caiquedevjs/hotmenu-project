const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/webhook',
    createProxyMiddleware({
      target: 'https://hotmenu.com.br',
      changeOrigin: true,
      secure: false,
    })
  );
};
