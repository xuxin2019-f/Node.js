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



**node开发场景：**

​     作为前后端中间的中间层做一些逻辑和转发

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

提供了对TCP和socket的支持

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



### Node异步IO模型

### Node单线程模型

### Node模块





### express和KOA功能详解

  express所有的功能都继承在express的包中，而KOA是将大部分功能移到第三方插件，使得自己本身的功能精炼小巧。