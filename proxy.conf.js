const PROXY_CONFIG = [
  {
    context: [
      "/api"
    ],
    target: "http://localhost:8080",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: (proxyReq, req, res) => {
      console.log('onProxyReq called');
      if (req.headers.authorization) {
        console.log('Authorization header found:', req.headers.authorization);
        proxyReq.setHeader('Authorization', req.headers.authorization);
      } else {
        console.log('Authorization header not found');
      }
    }
  }
];

module.exports = PROXY_CONFIG;
