const http = require('http')
const server = new http.Server()
server.on('request', (req, res) => {
  res.statusCode = 200
  res.setHeader(('Content-Type', 'text/html'))
})
server.listen(9093, () => {
  console.log('server is on port:9093')
})
