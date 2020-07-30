const net = require('net')

const client = new net.Socket()

client.connect(8888, 'localhost', () => {
  console.log('client is connected')
  client.write('message from client')
})
//服务端向客户端发送数据了
client.on('data', (data) => {
  console.log('data from server: ' + data.toString())
  client.write('message2 from client')
})
//数据都发送完毕后
client.on('end', () => {
  console.log('event end')
})
