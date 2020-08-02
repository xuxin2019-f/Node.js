# Node重学一遍！

首先node是一个框架，不是一个语言， 是一个基于 **Chrome V8** 引擎的 JavaScript 代码运行环境

JS本身是一种动态语言 是面向对象和函数式变成的结合

node包管理器：npm/yarn 用于下载第三方依赖 https://www.npmjs.com

npm到底是什么？

**nodejs本质是一个单线程（指的是主线程），怎么实现高并发？**

-  nodejs只有一个主线程，但底层大量使用事件驱动（当某个事件发生了就会触发相应流程，当另一个事件发生了又会触发相应流程）的思想，
-  底层架构大量使用**异步和回调**，异步是通过回调的形式获取结果：第一行代码执行后执行第二行时可能第一行结果还没拿到
- nodejs主线程是单线程，但主线程不会处理具体的任务，仅仅是接受客户端的请求，并传递给队列通过事件循环来执行

```js
//同步形式
let result = a.method1()
a.method2()
a.method3() //上一个执行完了才执行下一个

//异步形式 结果传递给回调函数的参数，如果第一个函数执行时间很长，可能第二个函数拿到结果后才能拿到第一个函数的结果
a.method1(callback(result){
          
 })
a.method2(callback(result){
        
 })
// 这样写的问题是可能会出现多层回调函数的嵌套，产生回调地狱，解决方法如Promise
```



### **node开发场景：**

有另外的服务端做逻辑处理，而node作为前后端中间的中间层:

         1. 对请求做预处理
            2. 做一些简单的业务处理：如登陆业务存储session，这样就保证转发到后端的请求一定是已经登陆的用户

### nvm配置和重要命令解读

  Node Version Manager：nvm ，node的版本管理器

   本身不支持window环境，可以安装nvm-windows：https://github.com/coreybutler/nvm-windows

   **win10下载nvm教程**：https://www.jianshu.com/p/3bd32f1848af

**这里的坑：**

-    下载后找不到npm，则根据node对应的npm版本去下载，解决链接：https://www.jianshu.com/p/c7ca83217618
-   由于我之前设置过npm的配置，在重装后配置依旧有效，所有的node安装包都装去了另一个地址，因此修改：

```
npm config set prefix "D:\NVM\nodejs\node_global"
npm config set cache "D:\NVM\nodejs\node_cache"
再在环境中配置NODE_PATH
```

https://www.jianshu.com/p/5db570f53e6a  



 下载nvm-windows之后，利用版本管理器下载node

​    **然后通过nvm install node具体版本号 来下载具体版本的nodejs**

### Node事件与回调机制

####   http模块详解与事件回调机制

 首先可以去node官方看文档https://nodejs.org/en/docs/

​    最基础的模板：

```js
//Node/10/src/app/app1.js
const http = require('http')
// 本质是对请求的一个监听器，当请求来的时候创建req、res这两个对象，并创建回调
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  })
  res.end('hello')
})
server.on('listening', () => {
  console.log('server is listenning')
})
// 客户端和服务器建立连接
server.on('connection', () => {
  console.log('client is connect')
})
server.on('close', () => {
  console.log('server is close')
})
server.listen(9093, () => {
  console.log('server is on port:9093')
})

//修改成监听模式
//app2.js
const http = require('http')
const server = new http.Server()
server.on('request', (req, res) => {
  res.statusCode = 200
  res.setHeader(('Content-Type', 'text/html'))
})
server.listen(9093, () => {
  console.log('server is on port:9093')
})

//app3.js 由于request和response都是流，监听流的输入
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

```

   **使用http创建客户端请求：**

​     **服务器启用app3.js ，可以发现在node环境下发送客户端请求，服务端默认的headers头里connection默认为close短连接，而如果是在浏览器环境下的客户端请求，默认是http1.1的长连接keep-alive**

```js
//app4.js
//用http模块创建的客户端
const http = require('http')

let responseData = ''

//request方法建立了一个客户端请求：接收options，回调
http.request({
  'host':'localhost',
  'port':'9093',
  'method':'get'
},(res)=>{
  res.on('data',chunk=>{
    responseData += chunk
  })
  res.on('end',()=>{
    console.log(responseData)
  })
}).end()


```

####     常用模块

#####   原生模块

###### 1.url：解析url地址

```js
//字符串转对象  url.parse
const url = require('url')
const urlString = 'http://www.baidu.com'
const urlObject = url.parse(urlString)
console.log(urlObject)

//对象转字符串 url.format
const url = require('url')
const urlObject = {
    'host':'www.test.com',
    'port':80,
    'protocol':'http', //协议
    'search':'?order=123',//查询字符串
    'query':'order=123',
    'path':'/'
}
let realAddress = url.format(urlObject)

//拼接地址 url.resolve
const urlAddress = url.resolve('http://www.test.com','order')
```

###### 2.querystring：查询字符串的方法

```js
const querystring = require('querystring')

//解析字符串成对象 querystring.parse
let queryData = 'name=xx&age=18'
console.log(querystring.parse(queryData)) //{ name: 'xx', age: '18' }

//解析成字符串 querystring.stringify()
```

###### 3.util  是一个Node.js 核心模块，提供常用函数的集合，用于弥补核心 JavaScript 的功能 过于精简的不足。 

```js
//util.js

//1. util.inspect:将对象转化成字符串，第二个参数可以做一些配置，如不同的参数类型用不同的颜色
const util = require('util')

const obj = {
  name: 'xx',
  age: 18,
  single: true,
  getAge: function () {
    return this.age
  },
}

const str = util.inspect(obj, {
  colors: true,
})

console.log(str)

//2.inherits 继承原型的方法，但不继承构造函数中的属性和方法
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
M.sayname() //构造函数上的方法不继承 报错


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
```

###### 4.path

注意__dirname指的是当前文件所在路径

```js
// path.js

//1.path.join路径拼接 将路径片段使用特定的分隔符（window：\）连接起来形成路径，，Unix系统是”/“，并规范化生成的路径。
const path = require('path')

const outputPath = path.join(__dirname, 'myPath', 'hello.js')
console.log(outputPath)

//2.path.extname获取路径扩展名
const extInfo = path.extname(outputPath)
console.log(extInfo) //.js

//3.path.parse 解析路径
console.log(path.parse(outputPath))

//4.path.resolve将相对路径转化为绝对路径，注意！resolve把'/'当做根路径

const path = require('path');

const path1 = path.resolve('/a/b', '/c/d');
// 结果： /c/d
const path2 = path.resolve('/a/b', 'c/d');
// 输出： /a/b/c/d
const path3 = path.resolve('/a/b', '../c/d');
// 输出： /a/c/d
const path4 = path.resolve('a', 'b');
// 输出： /Users/xiao/work/test/a/b

//另一个例子：
path.resolve('www', 'static', '../public', 'src', '..');
// cd www  /Users/xiao/work/test/www
// cd static /Users/xiao/work/test/www/static
// cd ../public /Users/xiao/work/test/www/public
// cd src /Users/xiao/work/test/www/public/src
// cd .. /Users/xiao/work/test/www/public

//path.resolve和path.join的区别
1.join是把各个path片段连接在一起， resolve把‘／’当成根目录
path.join('/a', '/b'); 
// /a/b
path.resolve('/a', '/b');
// /b

2.resolve在传入非/路径时，会自动加上当前目录形成一个绝对路径，而join仅仅用于路径拼接
// 当前路径为
/Users/xiao/work/test
path.join('a', 'b', '..', 'd');
// a/d
path.resolve('a', 'b', '..', 'd');
// /Users/xiao/work/test/a/d
可以看出resolve在传入的第一参数为非根路径时，会返回一个带当前目录路径的绝对路径。

```

###### 5.dns 

```js
//dns.js
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
```

###### 6.fs 文件系统

- 文件读取操作

```js
// 同步的读取需要用try catch包裹起来来处理异常
const fs = require('fs')
try {
  const data = fs.readFileSync('text.txt', 'utf8')
  console.log(data)
} catch (error) {
  console.log(error)
}

//异步的读取有三个参数：path、options为字符串或一个对象(包含encoding和flag)、callback
//其中encoding为编码，如果不指定，读取的是buffer类型的数据，此时如果要读取真正的内容需要写成(err,data)=>console.log(data.toString()),一般指定为utf8，就可以直接读取内容
//flag指明如何操作该文件 https://nodejs.org/dist/latest-v12.x/docs/api/fs.html#fs_file_system_flags

fs.readFile('text.txt', 'utf8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    //如果没有utf8，data读取的是buffer数据，要读取真的数据要用data.toString()
    console.log(data)
  }
})
```

**推荐使用异步的方式，因为node是单线程，这样不阻塞线程**

- 文件写入

```js
//有4个参数：file、data写入数据、options(可选，包含encoding、mode、flag)、callback

//注意这里的a代表每次写入都不覆盖原文件内容，而是追加，如果不写这个选项，默认每次写入都覆盖原文件的内容
fs.writeFile('write.txt', 'write txt', { flag: 'a' }, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('write successfully')
  }
})
```

- 文件删除

```js
fs.unlink('text.txt', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('delete successfully')
  }
})
```

- 文件重命名

通常用在客户端提交了文件，服务端将文件名存储在数据库，将真正的文件重命名后存储在磁盘内

```js
fs.rename('hello.txt', 'word.txt', (err) => {
  if (err) {
    console.log(err)
  }
  fs.stat('word.txt', (err) => {
    if (err) {
      console.log(err)
    }
  })
})
```

- 追加文件

fs.appendFile

- 创建文件夹

```js
fs.mkdir('mydir', (err) => {
  if (err) {
    console.log(err)
  }
  console.log('make dir successfully')
})
```

- 删除文件夹： fs.rmdir
- 读取文件夹内的所有文件

```js
fs.readdir('./', (err, files) => {
  if (err) {
    console.log(err)
  }
  console.log(files)
})
```

**!注意，node在实际开发中不能只用一个if(err)然后在里面throw error这种写法，否则会一层层向上传递直到主线程，这样会导致主线程的崩塌，应该及时捕获。**

- **根据相对路径获取绝对路径**

```js
fs.realpath('app.js', (err, resolvePath) => {
  if (err) {
    console.log(err)
  } else {
    console.log(resolvePath)
  }
})
```

- 文件的可写流和可读流

```js
//创建可读流
const rs = fs.createReadStream('word.txt', {
  encoding: 'utf8',
  highWaterMark: 3,
})
// rs.on('open', () => {
//   console.log('文件打开')
// })
// rs.on('data', (data) => {
//   console.log(data)
// })
// rs.on('end', () => {
//   console.log('读取结束')
// })

//创建可写流
const ws = fs.createWriteStream('write.txt', {
  encoding: 'utf8',
})
// rs.on('data', (data) => {
//   ws.write(data)
// })
rs.pipe(ws)
```

###### 7.buffer

不需要require调用，可以直接用

buffer内存储的是2进制数据

```js
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

```

###### 8.net

提供了对TCP的支持

**http模块是构建在net模块之上的，http中收发的数据是通过net模块中的socket收发数据的，http会将收发的数据按照HTTP协议自动解析和包装：例如http模块自动将请求报文解析后挂载给req请求对象。**

为什么既有net又有http：http知识一个基于net之上的模块，该模块遵循http协议。而又的业务功能使用的是别的协议。但是他们都是基于最基本的 Socket 网络编程模型而构建的

**服务端：server = net.createServer+server.listen** 

**客户端：client = new net.Socket() client.connect(....)**

而http的客户端： http.request(....)

- **实现TCP连接**

```js
const net = require('net')
//第一个参数options是可选的，可填两个布尔值：allowHalfOpen和pauseOnConnect
const server = net.createServer((socket) => {
  //客户端连接时才执行
  console.log('client connected')
  //console.log(socket)
})
server.listen(8888, () => {
  console.log('server is listening')
  //拿到对应的服务端的一些地址信息
  const address = server.address()
  console.log(address.port, address.address, address.family)
})
```

此时需要建立客户端连接，**在windows上通过telnet localhost 8888 来发起客户端请求**

**设置最大连接个数：**

```js
const net = require('net')
const server = net.createServer((socket) => {
  console.log('client connected')

  //限制连接数
  server.maxConnections = 2

  //获取实时连接数
  server.getConnections((err, count) => {
    console.log('client count:' + count)
  })
})
server.listen(8888, () => {
  console.log('server is listen')
})

//启动后，客户端模拟出两个，再多就会被拒绝请求
```

**服务端和客户端进行交互：**

  服务端传数据用socket.write,接受客户端传来的数据用socket.on('data',()=>{})

```js
//10/src/app/tcp/app.js
const net = require('net')
//第一个参数options是可选的，可填两个布尔值：allowHalfOpen和pauseOnConnect
const server = net.createServer((socket) => {
  //客户端连接时才执行
  console.log('client connected')
  //获取服务端地址信息
  const address = server.address()
  //向客户端发送信息
  const message = 'server address is ' + JSON.stringify(address)
  socket.write(message, () => {
    //回调，这里计算服务端发送了多少字节
    const writeSize = socket.bytesWritten
    console.log('message size is ' + writeSize)
  })
  //接受客户端发送来的数据
  socket.on('data', (data) => {
    console.log(data.toString())
    const readSize = socket.bytesRead
    console.log('data size is ' + readSize)
  })
})
server.listen(8888, () => {
  console.log('server is listening')
})

```

**用net模块模拟客户端请求：**

```js
const net = require('net')

const client = new net.Socket()
//端口号、主机名、回调
client.connect(8888, 'localhost', () => {
  console.log('client is connected')
})

```

**完整案例：**

```js
//app.js 模拟服务端 socket.write实现向客户端发送数据，socket.on('data',(data)=>{})监听客户端发送来的数据
 const net = require('net')
//第一个参数options是可选的，可填两个布尔值：allowHalfOpen和pauseOnConnect
const server = net.createServer((socket) => {
  //客户端连接时才执行
  console.log('client connected')
  //获取服务端地址信息
  const address = server.address()
  //向客户端发送信息
  const message = 'server address is ' + JSON.stringify(address)
  socket.write(message, () => {
    //回调，这里计算服务端发送了多少字节
    const writeSize = socket.bytesWritten
    console.log('message size is ' + writeSize)
  })
  //接受客户端发送来的数据
  socket.on('data', (data) => {
    console.log(data.toString())
    const readSize = socket.bytesRead
    console.log('data size is ' + readSize)
  })
})
server.listen(8888, () => {
  console.log('server is listening')
})


//client.js 模拟客户端，const client = new net.Socket()建立客户端,client.write向服务端发送数据，client.on('data',(data)=>{})监听服务端发送来的数据
const net = require('net')

const client = new net.Socket()

client.connect(8888, 'localhost', () => {
  console.log('client is connected')
  client.write('message from client')
})
//服务端向客户端发送数据了
client.on('data', (data) => {
  console.log('data from server: ' + data.toString())
  client.write('message2 from client')
})
//数据都发送完毕后
client.on('end', () => {
  console.log('event end')
})

```

###### 9.Datagram -》 dgram

**实现UDP连接，即用户数据包协议**

UDP无需建立三次握手连接，不在意丢包。

```js
//tcp/app.js 模拟服务端
const dgram = require('dgram')
const message = Buffer.from('this message comes from server')
const socket = dgram.createSocket('udp4', (msg, info) => {
  // 发送的消息 开始的长度 结束的长度 服务端端口号 服务端地址
  socket.send(
    message,
    0,
    message.length,
    info.port,
    info.address,
    (err, bytes) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('server has send ' + bytes + 'bytes message')
    }
  )
})
socket.bind(9999, 'localhost', () => {
  console.log('server has binded to 9999')
})

//监听客户端发送来的数据
socket.on('message', (msg, info) => {
  console.log('messgage from client' + msg.toString())
})

//client.js 模拟客户端
const dgram = require('dgram')
const message = Buffer.from('this message comes from client')
const socket = dgram.createSocket('udp4')

//发送消息
socket.send(message, 0, message.length, 9999, 'localhost', (err, bytes) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('client has send ' + bytes + ' bytes message')
})

socket.on('message', (msg, info) => {
  const message2 = 'hello world'
  console.log(msg.toString())
  socket.send(message2, 0, message2.length, 9999, 'localhost')
})

```

##### 第三方模块

###### 1.**自定义模块**

```js
// myModuls.js
const age = 19
const sayAge = function () {
  console.log(age)
}
//注意显式的导出
exports.age = age
exports.sayAge = sayAge

//引入
const aboutMe = require('./myModuls.js')
aboutMe.sayAge()
```

###### 2.自定义第三方模块

所有的第三方模块都在node_modules里执行。

因此首先建立threeModule文件夹，在里面建立app.js来运行代码，建立node_modules文件夹存储第三方依赖，在node_modules里建立一个myModule第三方依赖文件，里面初始化package.json，并将main入口文件指向myModule.js文件，再建立一个myModule.js文件实现第三方依赖

```js
//app.js
 const myModule = require('myModule')
 
//node_modules/myModule/myModule.js
 console.log('hello')

//node_modules/package.json
{
  "name": "myModule",
  "version": "1.0.0",
  "description": "",
  "main": "myModule.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}


```

###### 3.socket.io

 首先websocket是基于http之上的，**因此在建立websocket连接之前会先建立http连接，websocket的协议为ws。**socket.io是基于websocket的一种封装，在浏览器不支持websocket的情况下降为轮询。

 **socket.io在服务端的基本使用流程是首先建立一个http服务器，然后io.listen包裹这个服务，转化成websocket协议，然后进行双工操作。**

 客户端可以下载socket.io-client或者下载js包再用script引入；或者引入官网cdn

```js
//io/app.js 模拟服务端
//自带的事件监听有： socket.on('connection',(socket)=>{
  // socket.on('message',(message)=>{})和socket.on('disconnect',()=>{})
//}) 
//自定义发送和监听事件： socket.emit('事件名称',参数) socket.on('事件名称',回调)
//广播事件：socket.broadcast.emit('事件名称',参数) 适用于聊天室用户上线提醒等

const http = require('http')
const io = require('socket.io')
const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    })
    fs.readFile('client.html', (err, data) => {
      if (err) {
        console.log(err)
      } else {
        res.end(data.toString())
      }
    })
  }
})

server.listen(3000, () => {
  console.log('server is listening')
})

//包裹httpserver，进行转化
const mysocket = io.listen(server)
mysocket.on('connection', (socket) => {
  console.log('connection has been established')
  //原生的发送事件监听
  socket.on('message', (message) => {
    console.log('message' + message)
  })
  //原生的断开事件监听
  socket.on('disconnection', () => {
    console.log('connection has lost')
  })
  //自定义发送事件
  socket.emit('serverEvent', 'serverMsgs')
  socket.on('clientEvent', (data) => {
    console.log(data)
  })
  socket.on('clientBroadcast', (data) => {
    console.log(data)
    //加上broadcast代表对所有客户端进行发送，即广播
    //不加代表只对当前对服务端发送数据的客户端进行发送
    socket.broadcast.emit('serverBroadcast', 'broadcast!!')
  })

  socket.send('hello')
})

//client.html模拟客户端
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io('http://localhost:3000')

      socket.on('message', (message) => {
        console.log('data from server: ' + message)
      })
      socket.on('disconnect', () => {
        console.log('disconnect')
      })
      socket.on('serverEvent', (data) => {
        console.log(data)
        //在接收到服务端发送来的消息后，返回给服务端新的消息
        socket.emit('clientEvent', 'clientMsgs')
      })
      socket.emit('clientBroadcast', 'prepare to broadcast')
      socket.on('serverBroadcast', (data) => {
        console.log(data)
      })
    </script>
  </head>
  <body>
    123
  </body>
</html>

```



#### npm上传自定义模块流程

 创建文件夹后初始化package.json，在文件夹内创建一个文件写逻辑并导出，并根据package.json的入口文件来创建该文件，引入书写逻辑的文件并导出

 上传npm：在该文件夹内npm adduser，若出错根据错误信息进行修改 

 也可以在网站npmjs.com/signup 进行上传

##### 完整实例

```js
//user/userService.js 导出一个模块模拟登陆
class UserService {
  login(username, password) {
    console.log('enter')
    console.log('form information', username, password)
    return true
  }
}
module.exports = new UserService()


//1.模拟通过浏览器发起客户端请求 user/app.js
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
//然后登陆网页localhost:3000/login?username=xx&password=123


//2.模拟node层发起客户端请求 前提是有app.js的存在，即已经写过浏览器发起客户端的逻辑
// nodeWeb.js
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

```

#### node事件模型详解

**Node.js 所有的异步 I/O 操作在完成时都会发送一个事件到事件队列。** 

Node.js 里面的许多对象都会分发事件：一个 net.Server 对象会在每次有新连接时触发一个事件， 一个 fs.readStream 对象会在文件被打开的时候触发一个事件、http、node中的流等， 所有这些产生事件的对象都是 events.EventEmitter 的实例。 

events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。

EventEmitter是一种观察者模式的时间监听，类似于http模块就是继承自这个事件对象，因此拥有它的所有方法，**如Emitter.on/addListener(eventName,listener)、emitter.once(eventName[, ...args])、emitter.emit(eventName[, ...args])、removeListener/off。。。**

```js
//Emitter.on(eventName,listener),第一个参数是监听事件，第二个参数是监听器，对于同一个事件可以注册一系列的监听器，按顺序放在一个监听数组里，当该事件被触发时，数组里的所有监听器按照注册顺序被执行。
//events.js
//模拟node中的事件
const http = require('http')
const httpServer = http.createServer()

httpServer.on('request', (req, res) => {
  if (req.url === '/') {
    console.log('one')
    res.end('this is one')
  }
})

const listener = function (req, res) {
  if (req.url === '/') {
    console.log('two')
    res.end('this is two')
  }
}
// httpServer.once('request', listener)
httpServer.on('request', listener)
//移除监听器
httpServer.off('request', listener)
httpServer.listen(3000, () => {
  console.log('server is running on 3000')
})

```

##### 最大事件监听数

 node中对于每个事件默认监听最大上限为10，也可以通过setMaxListeners进行设置

```js
const http = require('http')
const httpServer = http.createServer()
const events = require('events')
//设置最大上限数
httpServer.setMaxListeners(2)

....

//默认的最大监听数量
console.log('max listeners num: ' + events.EventEmitter.defaultMaxListeners)

//当对某个事件的监听器超过2，报警告：
(node:20468) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 3 request listeners added to [Server]. Use emitter.setMaxListeners() to increase limit
```

##### 自定义事件

 和socketio中的emit和on相同。自定义事件emit发射事件，on监听事件。on必须写在emit之前，否则导致事件发射出去的时候node还没有监听该事件，导致发射事件行为丢失。

```js
//自定义事件
httpServer.on('myEvents', (params1, params2) => {
  console.log('myEvents: ' + params1 + ' ' + params2)
})
httpServer.emit('myEvents', 'hello', 'hi')


//监听事件是否增加新的监听：newListener
emitter.once('newListener', (event, listener) => {
  //当监听到是该事件时，再次监听
  if (event === 'myEvent') {
    emitter.on('myEvent', () => {
      console.log('hi')
    })
  }
})
emitter.on('myEvent', () => {
  console.log('xx')
})
emitter.emit('myEvent')// hi xx
```



### ！Node底层事件模型与异步IO模型

***node的高性能是完整事件循环机制+底层的操作系统异步IO调用+线程池（底层库实现或由操作系统提供）相结合的结果。***首先主线程执行到异步事件，转发给底层操作系统进行IO调用，调用线程池里的空线程执行操作，当执行完毕，通知事件循环某事件执行完毕了，可以执行相应的回调。

 node的执行是异步非阻塞的，当执行时遇到一个异步事件，将其转发给操作系统内核来执行，node在其执行的过程中不会等待，而是立即向下执行，遇到异步事件再进行转发。在操作系统内核中，哪个异步事件先执行完，就先触发哪个异步事件的回调。

 由于这种特性，node中不要存在下一个异步函数基于上一个异步函数的结果，因为不保证哪个回调先执行，除非写嵌套。

  **事件循环机制：**

1. 循环开始，查看是否有待处理的事件，如果没有回到循环开始
2. 如果有，从事件队列中取出一个事件
3. 判断这个事件有没有对应的事件监听器，即回调
4. 如果没有，回到循环开始
5. 如果有，执行回调
6. 回到循环开始，开始新一轮的事件检测

### Node进程详解

 注意看官方文档

 `process` 对象是一个全局变量，提供了有关当前 Node.js 进程的信息并对其进行控制。 作为全局变量，它始终可供 Node.js 应用程序使用，无需使用 `require()`。 它也可以使用 `require()` 显式地访问：

```js
const process = require('process');
```

**一些属性：**

```js
//node版本号
console.log(process.version)
//node及node的一些依赖的版本号
console.log(process.versions)
//平台
console.log(process.platform)
//node的绝对路径
console.log(process.execPath)
//node配置信息
console.log(process.config)
//当前正在执行的node进程的数值 重要，一些监听进程的第三方工具需要监听这个pid来获取信息、重启进程
console.log(process.pid)
//系统架构
console.log(process.arch)
//内存使用情况，被大量第三方工具使用
console.log(process.memoryUsage())
//当前运行的目录
console.log(process.cwd())
//改变当前工作目录 这个不返回结果
// process.chdir('../')
// console.log(process.cwd())

//环境属性 在很多第三方工具中都会被使用
//比如给process.env添加一个变量，赋予其生产或开发的字符串供第三方识别来进行不同的操作:
//process.env.NODE_ENV = 'dev' / process.env.NODE_ENV = 'pro'
console.log(process.env)
```

**由于process继承自EventEmitter，因此监听了许多事件：**

```js
//退出
process.on('beforeExit', (code) => {
  console.log(`node process beforeExit: ${code}`)
})
process.on('exit', (code) => {
  console.log(`node process exit: ${code}`)
})

// process.exit(0)

//异常捕获 在node中如果某个错误一直没被捕获，就会冒泡到主线程导致主线程的瘫痪
process.on('uncaughtException', (err) => {
  if (err) {
    console.log(err)
    console.log('====')
    console.log('uncaughtException occured')
  }
})
//故意引发错误
a
```

 注意：

如果打算使用 `'uncaughtException'` 事件作为异常处理的最后补救机制，这是非常粗糙的设计方式。 此事件不应该当作 `On Error Resume Next`（出了错误就恢复让它继续）的等价机制。 **未处理异常本身就意味着应用已经处于了未定义的状态。如果基于这种状态，尝试恢复应用正常进行，可能会造成未知或不可预测的问题。**

此**事件的监听器回调函数中抛出的异常，不会被捕获。为了避免出现无限循环的情况，进程会以非零的状态码结束，并打印堆栈信息。**

如果在出现未捕获异常时，尝试去恢复应用，可能出现的结果与电脑升级时拔掉电源线出现的结果类似。 10次中有9次不会出现问题。 但是第10次可能系统会出现错误。

正确使用 `'uncaughtException'` 事件的方式，是用它在进程结束前执行一些已分配资源（比如文件描述符，句柄等等）的同步清理操作。 触发 `'uncaughtException'` 事件后，用它来尝试恢复应用正常运行的操作是不安全的。

想让一个已经崩溃的应用正常运行，更可靠的方式应该是启动另外一个进程来监测/探测应用是否出错， 无论 `uncaughtException` 事件是否被触发，如果监测到应用出错，则恢复或重启应用。



```js
// process.nextTick(callback,[...args])
//process.nextTick() 方法将 callback 添加到下一个时间点的队列。 在 JavaScript 堆栈上的当前操作运行完成之后以及允许事件循环继续之前，此队列会被完全耗尽。 即同步之后异步之前。
 const fs = require('fs')
const handle = () => {
  console.log('this is handle')
}
process.nextTick(handle)
console.log(fs.readFileSync('./app.js', 'utf8'))
setTimeout(() => {
  console.log('异步事件')
}, 0)
//读取文件的内容
//this is handle
//异步事件
```

####  node子进程

​    适用于密集cpu计算的场景。

**第一种方法：通过spawn生成**

  第一个参数可以是任何命令。**spawn没有回调。**

```js
//childProcess/app1.js
const { spawn } = require('child_process')
const lsChildProcess = spawn('node', ['../app.js'])
lsChildProcess.stdout.on('data', (data) => {
  console.log(data.toString())
  console.log(`child process id: ${lsChildProcess.pid}`)
})
lsChildProcess.on('error', (err) => {
  console.log('err', err)
})
lsChildProcess.on('exit', (code, signal) => {
  console.log(code)
})
//app2.js
const { spawn } = require('child_process')
const nodeChildProcess = spawn('node', ['app1.js'])
nodeChildProcess.stdout.on('data', (data) => {
  console.log(data.toString())
  console.log(`child2 process id: ${nodeChildProcess.pid}`)
})
//此时app2内的nodeChildProcess作为一个子进程，内部还有一个lsChildProcess子进程
```

**第二种方法：fork，一种特殊的spawn方法，只用于产生node的子进程。该模块已建立了 IPC 通信通道，可以在父进程与子进程之间发送消息。**

由于默认子主进程的打印结果会放在一个控制台上，造成混乱，设置silent为true，只显示父进程的打印结果。如果要调试子进程，在test.js中的console.log(message)处打断点，然后debug app3，发现跳转到test的断点处，手动往下执行，在vscode的调试控制台处能看到完整打印。

```js
//app3.js
const { fork } = require('child_process')
//待执行的子进程地址 参数 可选参数
const forkProcess = fork('./test', { silent: true })
//主、子进程的通信
// 发送消息来的监听
forkProcess.on('message', (message) => {
  console.log(message)
})
// 发送消息
forkProcess.send('hello')


//test.js
[1, 2, 3, 4, 5].forEach((element) => {
  console.log(element)
})
process.on('message', (message) => {
  console.log(message)
  process.send('welcome')
})

```

**第三种方法：exec(command,[options],[callback]）**

注意command要包含命令和待执行命令的模块，**并且exec有回调**。

```js
const { exec } = require('child_process')
exec('node test', (err, stdout, stderr) => {
  if (err) {
    console.log(err)
  } else {
    console.log(stdout.toString())
  }
})
```

**第四种方法：execFile。与exec不同，不会衍生shell。**

#### Cluster集群

 **单个 Node.js 实例运行在单个线程中。 为了充分利用多核系统，有时需要启用一组 Node.js 进程去处理负载任务。**

**`cluster` 模块可以创建共享服务器端口的子进程。**

 **工作进程由 [`child_process.fork()`](http://nodejs.cn/s/VDCJMa) 方法创建，因此它们可以使用 IPC 和父进程通信，从而使各进程交替处理连接服务。因此cluster中通过cluster.fork创建子进程。**

**cluster 模块支持两种分发连接的方法。**

**第一种方法**（也是除 Windows 外所有平台的默认方法）是循环法，由主进程负责监听端口，接收新连接后再将连接循环分发给工作进程，在分发中使用了一些内置技巧防止工作进程任务过载。

**第二种方法是**，主进程创建监听 socket 后发送给感兴趣的工作进程，由工作进程负责直接接收连接。

 cluster改变了主进程做请求处理的模式，而是将主进程改为转发请求给子进程的模式，主进程和子进程是双向通信的，使用Master主进程和Worker子进程最大利用多核处理能力。

```js
// 要求：根据cpu核心数来分配进程数
const cluster = require('cluster')
const http = require('http')
const os = require('os')

// 查询cpu核心数 是8 因此这里分配8个子进程
const cpuCount = os.cpus().length
//console.log(cpuCount)

// isMaster判断是否是父进程 isWorker判断是否是子进程
if (cluster.isMaster) {
  console.log('father')
  //如果是父进程，则创建子进程
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork()
  }
  //每次创建
  cluster.on('exit', (worker, code, signal) => {
    // worker指创建出来的进程
    console.log(worker.process.pid)
  })
} else {
  //子进程fork出来后会重新执行程序，因此这里要有判断
  // 由子进程创建http服务器
  const httpServer = http.createServer((req, res) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      })
      res.end(`${process.pid}`)
    })
  })
  //请求先到达的是主进程，因此这个3000是主进程监听的，再由主进程转发请求给某个子进程
  httpServer.listen(3000, () => {
    console.log(`child:${process.pid}`)
  })
}

```



### Node单线程模型

  **node所谓的单线程指的是其逻辑执行的主线程是单线程的，即js代码运行环境是单线程的，因为js本身只能执行在单线程中。**而当node执行过程中遇到异步事件，会调用底层操作系统来执行IO调用，并结合**线程池**中的空闲线程来完成事件操作。

### Node引入第三方模块机制

  node -> 调用某个第三方模块(通常依赖于node原生模块) -> 调用原生模块 -> 原生模块的实现 -> 调用底层C++模块 -> libuv/IOCP -> 线程池选取可用线程执行底层IO操作

### ！Node实现通信

1. http服务端和客户端

req/res.on('data')接收，服务端res.end()发送，客户端get方法通过地址path发送

```js
// 服务端
const server = http.createServer((req,res)=>{
    let reqData = ''
    //接收消息
    req.on('data',data=>{
        reqData += data
    })
    req.on('end',()=>{
        resData = xxxx
        //发送数据
        req.end(resData)
    })
})

//客户端
const client = http.request({
    host:'localhost',
    port:'9093',
    method:'get',
    //发送参数
    path:'/login?username=xx&password=123'
},(res)=>{
    res.on('data',data=>{
        resData += data
    })
    res.on('end',()=>{
        xxxxx
    })
}).end()
```

2. tcp服务端和客户端

通过socket/client.on('data')接收，通过socket/client.write发送

```js
//服务端
const server = net.createServer(socket=>{
    const message = xxxxx
    //发送
    socket.write(message,()=>{
        xxxx
    })
    //接收
    socket.on('data',data=>{
        xxxxx
    })
})

//客户端
const client = new net.Socket()
client.connect(port,host,()=>{
    //发送
    client.write(xxx)
})
//接收
client.on('data',data=>{
    xxxx
    //发送
    client.write('xxxx')
})
```

3. 通过sockets

```js
//服务端
const server = http.createServer(....)
const socket = io.listen(server)
socket.on('connection',(socket)=>{
    //1.原生事件
    //接收数据
    socket.on('message',message=>{
        xxxx
    })
    socket.on('disconnection',()=>{
        xxxx
    })
    //发送数据
    socket.send(xxx)
    
    //2.自定义接收和发送
    //接收
    socket.on('clientEvent',(data)=>{
        xxxx
    })
    //发送
    socket.emit('ServerEvent',发送的内容)
})

//客户端
const socket = io(地址)
//接收
socket.on('ServerEvent',(data)=>{
    xxxx
    //发送
    socket.emit('clientEvent',发送的内容)
})
```

   4.进程间的通信

通过child_process的fork进行通信：on('message')+send

```js
//父进程
const { fork } = require('child_process')
//待执行的子进程地址 参数 可选参数
const forkProcess = fork('./test', { silent: true })
//主、子进程的通信
// 发送消息来的监听
forkProcess.on('message', (message) => {
  console.log(message)
})
// 发送消息
forkProcess.send('hello')

//子进程
;[1, 2, 3, 4, 5].forEach((element) => {
  console.log(element)
})
process.on('message', (message) => {
  console.log(message)
  process.send('welcome')
})

```



### KOA功能详解

  express所有的功能都继承在express的包中，而KOA是将大部分功能移到第三方插件，使得自己本身的功能精炼小巧。

  **KOA的ctx上下文环境封装了request和response，这里的request和response并不是node原生的请求和响应，而是在此基础上封装后的。**

```js
 app.use((ctx,next)=>{
     //ctx.request.url  = ctx.url
     //ctx.response.body = ctx.body
 })
```

 **如果要拿到node原生的请求和响应，通过ctx.req和ctx.resp获取（不建议）。**

####  ！中间件

每一个app.use后都是一个中间件，这个中间件可以是第三方或是自定义的。

1. **koa的洋葱模型**

从外向里执行，每一次遇到await next()后执行下一个中间件，都执行完毕后再层层向外执行。

```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log('one start')
  await next()
  console.log('one finish')
})
app.use(async (ctx, next) => {
  ctx.body = 'hello world'
  console.log('two start')
  await next()
  console.log('two finish')
})
app.use(async (ctx, next) => {
  console.log('three start')
  await next()
  console.log('three finish')
})
app.listen(3000, () => {
  console.log('ok')
})

//打印
one start
two start
three start
three finish
two finish
one finish
one start
two start
three start
three finish
two finish
one finish
```

#### 完整开发

1.由于node是中间层，所以config文件夹下建立client处理node转发请求给真正的服务端时，node作为客户端的处理；还建立server处理客户端请求给node时，node作为服务端的处理。实际开发中，这两个模块内的地址是不一样的，比如login实际开发中client和server里地址不相同。

在写完两个配置json文件后，还需要第三方插件的帮助来解析json。

2.app文件夹存放主入口文件app.js。在主入口文件需要引入以下中间件：

-  @koa/router
-  koa-bodyparser
-  koa-static
-  koa-compress做请求体压缩
-  koa-combine-routers 合并多个路由
-  axios 这里的用处是用于node服务层向后端发请求
-  jsonfile 解析json配置文件