const http = require('http')
const fs = require('fs')
const server = http.createServer((request, response) => {
  // response.end('hello ...')
  const { url, method, headers } = request
  if (url === '/' && method === 'GET') {
    // 静态页面服务
    fs.readFile('index.html', (err, data) => {
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/html')
      response.end(data)
    })
  } else if (url === '/users' && method === 'GET') {
    // Ajax服务
    response.writeHead(200, {
      'Content-Type': 'application/json',
    })
    response.end(
      JSON.stringify({
        name: 'laowang',
      })
    )
  } else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {
    // 图片文件服务
    // 由于浏览器在解析html时，遇到有外链资源的属性如src、href会发起第二轮请求
    // 这里的 headers.accept.indexOf('image/*') !== -1表明是解析到index.html的img的第二轮请求
    // 所以这里的url是node.png
    fs.createReadStream('./' + url).pipe(response)
  }
})
server.listen(3000)
