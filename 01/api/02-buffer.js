// const buf1 = Buffer.alloc(10,22);
// console.log(buf1)

// const buf2=Buffer.from('a')
// console.log(buf2,buf2.toString())

const buf3 = Buffer.from('Buffer创建方法')
console.log(buf3)
const buf1 = Buffer.alloc(10, 22)
buf1.write('hello')
console.log(buf1)
const buf2 = Buffer.from('hello')
console.log(buf2)
