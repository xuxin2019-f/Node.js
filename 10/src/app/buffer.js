const str = 'hello world'
// 将字符串转换成buffer
const buf1 = Buffer.from(str)
// 将buffer转换成字符串
console.log(buf1.toString())

//填充多少单位的字节
const buf2 = Buffer.alloc(10, 22)
console.log(buf2)

//拼接 第一个参数是数组，里面是要拼接的buffer，第二个参数选填，是总长
const buf3 = Buffer.concat([buf1, buf2], buf1.length + buf2.length)
console.log(buf3)

//转json
const jsonStr = JSON.stringify(buf1)
console.log(jsonStr)
const jsonObj = JSON.parse(jsonStr)
console.log(jsonObj)

//类型判断
// typeof无法分别对象和buffer
console.log(typeof buf1)
//用isBuffer判断
console.log(Buffer.isBuffer(buf1))
