const util = require('util')
const fs = require('fs')

const obj = {
  name: 'xx',
  age: 18,
  single: true,
  getAge: function () {
    return this.age
  },
}
//1.inspect 解析对象为字符串
const str = util.inspect(obj, {
  colors: true,
})

console.log(str)

//2.继承原型的方法，但不继承构造函数中的属性和方法
function Mother() {
  this.name = 'xx'
  this.sayname = () => {
    console.log(this.name)
  }
}
Mother.prototype.say = function () {
  console.log(this.name)
}
function Child() {
  this.name = 'xxx'
}
util.inherits(Child, Mother)
const M = new Child()
M.say() //原型上的方法可以继承
//M.sayname() //构造函数上的方法不继承 报错

//3.promisify 接受nodejs回调样式后的函数，转变为promise写法
const readFile = util.promisify(fs.readFile)
readFile('./url.js').then((data) => console.log(data))
//打印的是buffer

//结合async await
async function test() {
  const data = await readFile('./path.js')
  console.log(data)
}
test()
