const http = require('http')
const querystring = require('querystring')
const url = require('url')
const userService = require('./userService')

const server = http.createServer((req, res) => {
  let data = ''
  req.on('data', (chunk) => {
    data += chunk
  })
  //当请求全部处理完成
  req.on('end', () => {
    const { method } = req
    const myUrl = req.url
    //如果是个登陆请求
    if (myUrl.includes('login') && method === 'GET') {
      const reqParams = url.parse(myUrl)
      const queryObject = querystring.parse(reqParams.query)
      console.log(queryObject)
      const ifLogin = userService.login(
        queryObject.username,
        queryObject.password
      )
      if (ifLogin) {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        })
        res.end('loginResult' + queryObject.username)
      }
      res.end('error')
    }
  })
})
server.listen(3000, () => {
  console.log('server is listening on port 3000')
})
