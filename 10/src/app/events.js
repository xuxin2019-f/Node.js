//模拟node中的事件
const http = require('http')
const httpServer = http.createServer()

httpServer.on('request', (req, res) => {
  if (req.url === '/') {
    console.log('one')
    res.end('this is one')
  }
})

const listener = function (req, res) {
  if (req.url === '/') {
    console.log('two')
    res.end('this is two')
  }
}
// httpServer.once('request', listener)
httpServer.on('request', listener)
//移除监听器
httpServer.off('request', listener)
httpServer.listen(3000, () => {
  console.log('server is running on 3000')
})
