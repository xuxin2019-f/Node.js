const fs = require('fs')
// try {
//   const data = fs.readFileSync('text.txt', 'utf8')
//   console.log(data)
// } catch (error) {
//   console.log(error)
// }

// fs.readFile('text.txt', 'utf8', (err, data) => {
//   if (err) {
//     console.log(err)
//   } else {
//     //如果没有utf8，data读取的是buffer数据，要读取真的数据要用data.toString()
//     console.log(data)
//   }
// })

// fs.writeFile('write.txt', 'write txt', { flag: 'a' }, (err) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log('write successfully')
//   }
// })

//删除
// fs.unlink('text.txt', (err) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log('delete successfully')
//   }
// })

//重命名
// fs.rename('hello.txt', 'word.txt', (err) => {
//   if (err) {
//     console.log(err)
//   }
//   fs.stat('word.txt', (err) => {
//     if (err) {
//       console.log(err)
//     }
//   })
// })

//创建文件夹
// fs.mkdir('mydir', (err) => {
//   if (err) {
//     console.log(err)
//   }
//   console.log('make dir successfully')
// })

//读取文件夹内的所有文件
fs.readdir('./', (err, files) => {
  if (err) {
    console.log(err)
  }
  console.log(files)
})

//根据相对路径获取绝对路径
fs.realpath('app.js', (err, resolvePath) => {
  if (err) {
    console.log(err)
  } else {
    console.log(resolvePath)
  }
})

//创建可读流
const rs = fs.createReadStream('word.txt', {
  encoding: 'utf8',
  highWaterMark: 3,
})
// rs.on('open', () => {
//   console.log('文件打开')
// })
// rs.on('data', (data) => {
//   console.log(data)
// })
// rs.on('end', () => {
//   console.log('读取结束')
// })

//创建可写流
const ws = fs.createWriteStream('write.txt', {
  encoding: 'utf8',
})
// rs.on('data', (data) => {
//   ws.write(data)
// })
rs.pipe(ws)
