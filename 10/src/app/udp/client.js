const dgram = require('dgram')
const message = Buffer.from('this message comes from client')
const socket = dgram.createSocket('udp4')

//发送消息
socket.send(message, 0, message.length, 9999, 'localhost', (err, bytes) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('client has send ' + bytes + ' bytes message')
})

socket.on('message', (msg, info) => {
  const message2 = 'hello world'
  console.log(msg.toString())
  socket.send(message2, 0, message2.length, 9999, 'localhost')
})
