const http = require('http')
// 本质是对请求的一个事件监听，当请求来的时候创建req、res这两个对象，并创建回调
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
