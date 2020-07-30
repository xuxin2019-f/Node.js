const net = require('net')
//第一个参数options是可选的，可填两个布尔值：allowHalfOpen和pauseOnConnect
const server = net.createServer((socket) => {
  //客户端连接时才执行
  console.log('client connected')
  //获取服务端地址信息
  const address = server.address()
  //向客户端发送信息
  const message = 'server address is ' + JSON.stringify(address)
  socket.write(message, () => {
    //回调，这里计算服务端发送了多少字节
    const writeSize = socket.bytesWritten
    console.log('message size is ' + writeSize)
  })
  //接受客户端发送来的数据
  socket.on('data', (data) => {
    console.log(data.toString())
    const readSize = socket.bytesRead
    console.log('data size is ' + readSize)
  })
})
server.listen(8888, () => {
  console.log('server is listening')
})
