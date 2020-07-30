const http = require('http')
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  })
  res.end('hello')
})
server.on('listening', () => {
  console.log('server is listenning')
})
// 客户端和服务器建立连接
server.on('connection', () => {
  console.log('client is connect')
})
server.on('close', () => {
  console.log('server is close')
})
server.listen(9093, () => {
  console.log('server is on port:9093')
})
