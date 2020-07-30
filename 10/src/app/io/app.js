const http = require('http')
const io = require('socket.io')
const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    })
    fs.readFile('client.html', (err, data) => {
      if (err) {
        console.log(err)
      } else {
        res.end(data.toString())
      }
    })
  }
})

server.listen(3000, () => {
  console.log('server is listening')
})

//包裹httpserver，进行转化
const mysocket = io.listen(server)
mysocket.on('connection', (socket) => {
  console.log('connection has been established')
  //原生的发送事件监听
  socket.on('message', (message) => {
    console.log('message' + message)
  })
  //原生的断开事件监听
  socket.on('disconnection', () => {
    console.log('connection has lost')
  })
  //自定义发送事件
  socket.emit('serverEvent', 'serverMsgs')
  socket.on('clientEvent', (data) => {
    console.log(data)
  })
  socket.on('clientBroadcast', (data) => {
    console.log(data)
    //加上broadcast代表对所有客户端进行发送，即广播
    //不加代表只对当前对服务端发送数据的客户端进行发送
    socket.broadcast.emit('serverBroadcast', 'broadcast!!')
  })

  socket.send('hello')
})
