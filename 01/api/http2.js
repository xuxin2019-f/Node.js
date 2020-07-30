const http = require('http')
const fs = require('fs')
const URL = require('url')
const querystring = require('querystring')
const mongoose = require('mongoose')
const { Course } = require('./model')

const server = http.createServer((request, response) => {
  const { url, method, headers } = request
  // 请求路径
  var pathname = URL.parse(url).pathname
  console.log(pathname)
  // 解决跨域
  response.setHeader('Access-Control-Allow-Origin', '*')
  // 解决设置的头部
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (url === '/' && method === 'GET') {
    fs.readFile('index.html', (err, data) => {
      response.writeHead(200, {
        'Content-Type': 'text/html',
      })
      // mongoose
      //   .connect('mongodb://localhost/mytest')
      //   .then(() => {
      //     console.log('数据库连接成功')
      //   })
      //   .catch((err) => console.log('数据库连接失败', err))
      // Course.create({ name: 'xuxin123', age: 192 })
      //   .then((doc) => console.log('插入数据成功', doc))
      //   .catch((err) => console.log('插入数据失败', err))
      response.end(data)
    })
  } else if (url === '/info' && method === 'POST') {
    let postData = ''
    request.on('data', (chunk) => (postData += chunk))
    request.on('end', () => {
      console.log(querystring.parse(postData))
    })
    response.statusCode = 200
    response.setHeader = {
      'Content-Type': 'application/json',
    }
    response.end('info页')
  } else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {
    // 图片文件服务
    console.log(url)
    // 由于浏览器在解析html时，遇到有外链资源的属性如src、href会发起第二轮请求
    // 这里的 headers.accept.indexOf('image/*') !== -1表明是解析到index.html的img的第二轮请求
    // 所以这里的url是node.png
    fs.createReadStream('./' + url).pipe(response)
  } else {
    response.end('404 Not Found')
  }
})
server.listen(8000)
