const fs = require('fs')
const handle = () => {
  console.log('this is handle')
}
process.nextTick(handle)
console.log(fs.readFileSync('./app.js', 'utf8'))
setTimeout(() => {
  console.log('异步事件')
}, 0)
