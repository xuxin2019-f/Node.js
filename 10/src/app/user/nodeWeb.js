const http = require('http')
const userService = require('./userService')
let responseData = ''
http
  .request(
    {
      host: 'localhost',
      port: '3000',
      method: 'get',
      path: '/login?username=xx&password=123',
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
