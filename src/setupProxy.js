const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/webhook',
    createProxyMiddleware({
      target: 'https://hotmenu.com.br', // O servidor de destino
      changeOrigin: true, // Para mudar o 'origin' da requisição para o servidor de destino
      secure: false, // Defina como 'true' se o servidor usar HTTPS
      pathRewrite: {
        '^/webhook': '/webhook', // Reescreve o caminho da requisição
      },
    })
  );
};
