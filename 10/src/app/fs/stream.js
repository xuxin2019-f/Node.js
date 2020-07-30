//再练习一下流
const fs = require('fs')
const rs = fs.createReadStream('word.txt', {
  flags: 'r',
  encoding: 'utf8',
})
const ws = fs.createWriteStream('write.txt')
rs.on('open', () => {
  console.log('文件打开了')
})
rs.on('data', (data) => {
  ws.write(data)
})
rs.on('end', () => {
  console.log('文件读取完毕')
})
rs.on('close', () => {
  console.log('文件关闭了')
})
