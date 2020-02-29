const http = require('http')
const fs = require('fs')
const server = http
  .createServer((req, res) => {
  // response.end('hello ...')
  const {url, method} = req
    console.log('url:'+ url)
    console.log('cookie:'+ req.headers.cookie)
  if (url === '/' && method === 'GET') {
    // 静态页面服务
    fs.readFile('index.html', (err, data) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  } else if (url === '/api/users' && method === 'GET') {
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    // // 设置cookie
    // res.setHeader('Set-Cookie','cookie1 = 12223')
    // res.setHeader("Access-Control-Allow-Origin","http://localhost:3000")
    // res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({
      name: 'laowang',
      age: 20
    }))
  }
  //   else if (method === "OPTIONS" && url === "/api/users") {
  //   res.setHeader('Access-Control-Allow-Credentials', 'true');
  //
  //   res.writeHead(200, {
  //       "Access-Control-Allow-Origin": "http://localhost:3000",
  //       "Access-Control-Allow-Headers": "X-Token,Content-Type",
  //       "Access-Control-Allow-Methods": "GET,POST,PUT"
  //   });
  //   res.end();
  // }
  })
server.listen(4000)
