const aboutMe = require('./myModuls.js')
aboutMe.sayAge()

const dns = require('dns')

const domain = 'www.baidu.com'
//解析出ip地址 由于一个地址可以对应多个ip，所以得到的结果是一个数组
dns.resolve(domain, (error, data) => {
  if (error) {
    console.log(error)
    return
  }
  console.log('ip:', data)
})

const ip = '114.114.114.114'
//反向解析出域名 也是一个数组
dns.reverse(ip, (error, domain) => {
  if (error) {
    console.log(error)
    return
  }
  console.log('domain:', domain)
})
