const url = require('url')

const urlString = 'http://www.baidu.com'
console.log(url.parse(urlString))

const urlData = {
  protocal: 'http',
  host: 'www.xuxin.com',
  port: 80,
  path: '/',
}
console.log(url.format(urlData))
