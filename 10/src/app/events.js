//模拟node中的事件
const http = require('http')
const httpServer = http.createServer()
const events = require('events')
const emitter = new events()
//设置监听器的最大数量
//httpServer.setMaxListeners(2)

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
const listener3 = function (req, res) {
  if (req.url === '/') {
    console.log('three')
    res.end('this is two')
  }
}
//默认的最大监听数量
console.log('max listeners num: ' + events.EventEmitter.defaultMaxListeners)

// httpServer.once('request', listener)
httpServer.on('request', listener)
httpServer.on('request', listener3)
//移除监听器
//httpServer.off('request', listener)

//自定义事件
httpServer.on('myEvents', (params1, params2) => {
  console.log('myEvents: ' + params1 + ' ' + params2)
})
httpServer.emit('myEvents', 'hello', 'hi')

//监听事件是否增加新的监听：newListener
emitter.once('newListener', (event, listener) => {
  //当监听到是该事件时，再次监听
  if (event === 'myEvent') {
    emitter.on('myEvent', () => {
      console.log('hi')
    })
  }
})
emitter.on('myEvent', () => {
  console.log('xx')
})
emitter.emit('myEvent')
httpServer.listen(3000, () => {
  console.log('server is running on 3000')
})
