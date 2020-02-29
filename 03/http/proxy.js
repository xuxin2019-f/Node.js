const express = require('express');
// const proxy = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');



const app = express()
app.use(express.static(__dirname + '/'))
app.use('/api/users',createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: false }));
app.listen(3000)
