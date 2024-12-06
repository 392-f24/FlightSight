const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://api.flightapi.io', // API base URL
    changeOrigin: true,
    pathRewrite: { '^/api': '' }, // Remove /api prefix
  })
);

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});