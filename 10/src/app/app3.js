const http = require('http')
const server = http.createServer((req, res) => {
  let data = ''
  req.on('data', (chunk) => {
    data += chunk
  })
  req.on('end', () => {
    const { method, url, headers, httpVersion } = req
    let responseData =
      method + ',' + url + ',' + JSON.stringify(headers) + ',' + httpVersion
    res.end(responseData)
  })
})
server.listen(9093, () => {
  console.log('server is on port 9093')
})
