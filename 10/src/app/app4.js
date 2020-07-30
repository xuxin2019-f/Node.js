//用http模块创建的客户端
const http = require('http')
const querystring = require('querystring')

let responseData = ''
let queryData = 'name=xx&age=18'
console.log(querystring.parse(queryData))

//request方法建立了一个客户端请求：接收options，回调
http
  .request(
    {
      host: 'localhost',
      port: '9093',
      method: 'get',
    },
    (res) => {
      res.on('data', (chunk) => {
        responseData += chunk
      })
      res.on('end', () => {
        console.log(responseData)
      })
    }
  )
  .end()
