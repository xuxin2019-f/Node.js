const net = require('net')
const server = net.createServer((socket) => {
  console.log('client connected')

  //限制连接数
  server.maxConnections = 2

  //获取实时连接数
  server.getConnections((err, count) => {
    console.log('client count:' + count)
  })
})
server.listen(8888, () => {
  console.log('server is listen')
})
