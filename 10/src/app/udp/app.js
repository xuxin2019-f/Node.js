const dgram = require('dgram')
const message = Buffer.from('this message comes from server')
const socket = dgram.createSocket('udp4', (msg, info) => {
  // 发送的消息 开始的长度 结束的长度 服务端端口号 服务端地址
  socket.send(
    message,
    0,
    message.length,
    info.port,
    info.address,
    (err, bytes) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('server has send ' + bytes + 'bytes message')
    }
  )
})
socket.bind(9999, 'localhost', () => {
  console.log('server has binded to 9999')
})

//监听客户端发送来的数据
socket.on('message', (msg, info) => {
  console.log('messgage from client' + msg.toString())
})
