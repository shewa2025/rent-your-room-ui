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
      console.log('[proxy] onProxyReq called');
      if (req.headers.authorization) {
        console.log('[proxy] Authorization header found:', req.headers.authorization);
        proxyReq.setHeader('Authorization', req.headers.authorization);
      } else {
        console.log('[proxy] Authorization header not found');
      }
    }
  }
];

module.exports = PROXY_CONFIG;
