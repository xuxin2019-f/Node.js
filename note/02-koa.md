# Koa

## 区别

express与kos的区别：https://juejin.im/post/5da6eef5f265da5b6b631115?from=bdhd_site

**注意express是(req,res,next),koa是(ctx,next)**

**在koa2中直接可以从ctx中获取url和method**

```js
app.use(async(ctx,next)=>{
    //get获得表单页面
    if(ctx.url==='/' && ctx.method==='GET'){
        let html=`
            <h1>Koa2 request POST</h1>
            <form method="POST" action="/">
                <p>userName</p>
                <input name="userName" /><br/>
                <p>age</p>
                <input name="age" /><br/>
                <button type="submit">submit</button>
            </form>
        `;
        ctx.body=html;
    }
    //post提交表单信息
    else if(ctx.url==='/' && ctx.method==='POST'){
        let pastData=await parsePostData(ctx);
        ctx.body=pastData;
    }
    else{
        ctx.body='<h1>404!</h1>';
    }
 
});

```

Koa1是Express的下一代基于Node.js的web框架，是基于es6的generator/yield实现的

Koa2完全使用Promise并配合async来实现异步

## 使用

```js
const Koa = require('koa')
const app = new Koa()
app.use((context,next)=>{
  context.body = [
    {
      name:'xiaoli'
    }
  ]
})
app.listen(3000)
```

**第一个参数是上下文环境context（为了封装request，response），第二个参数是next，为了实现下一个中间件**

例如

这里第一个app.use里因为有next(),才执行了下一个app.use

```
app.use((context,next)=>{
  context.body = [
    {
      name:'xiaoli'
    }
  ]
  next()
})
app.use((ctx,next)=>{
  if(ctx.url === '/html') {
    ctx.type = 'text/html;charset=utf-8'
    ctx.body = `<b>我的名字是：${ctx.body[0].name}</b>`
  }
})
```

又例如

**第一个app.use中执行到await next()后执行第二个app.use(),当第二个app.use()执行到await next()后，再执行第三个app.use(),第三个执行完毕后，由于第二个app.use()的await next()后没有代码了，再返回第一个的await next()后执行相关代码**

这就是所谓的**中间件**

```
app.use(async (ctx,next)=>{
  const start = new Date().getTime()
  console.log('开始时间：'+ start)
  await next()
  const end = new Date().getTime()
  console.log('结束时间:' + end)
  console.log(`总共耗时${end-start}`)
})

app.use(async (context,next)=>{
  context.body = [
    {
      name:'xiaoli'
    }
  ]
 await next()
})

app.use((ctx,next)=>{
  if(ctx.url === '/html') {
    ctx.type = 'text/html;charset=utf-8'
    ctx.body = `<b>我的名字是：${ctx.body[0].name}</b>`
  }
})
```

### KOA中使用cookie和session

```js
router.get('/', async (ctx, next) => {
  let name = new Buffer("狗子").toString('base64')
  ctx.cookies.set("userInfo",name,{
    maxAge:1000*60*60
  })
})

router.get('/test', async (ctx, next) => {
  //从ctx里面获取get传值,query是格式化之后的，querystring是字符串的
  console.log(ctx.query)
  let userInfo = ctx.cookies.get("userInfo");
  let name = new Buffer(userInfo,'base64').toString()
  console.log(name)
  //ctx里面的request对象是那一大串东西
  ctx.body = 'koa2 string'
})
```

session是另一种记录客户状态的机制，不同的是cookie存储在客户短，session存储在服务器端。
 session的运行机制：浏览器访问服务器并第一次发送请求时，服务器端会创建一个session对象，类似于key-value的结构，然后把key以cookie的形式存储在客户端，浏览器后续每次请求服务器时都会带上这个key（也就是cookie），服务器根据这个key来查找相应的value，也就是session。客户的信息都存储在session中

```
router.get('/buy', async (ctx, next)=> {
  console.log(ctx.session.username) //读取session
  ctx.body = 'this is a users response!'
})

router.get('/login', function (ctx, next) {
  ctx.session.username="狗子"    //设置session
  ctx.body = '登陆成功'
})
```



## Koa源码实现

### 初步实现

**在source里的app.js中实现调用**

**在source里的kkb.js中实现源码**

```
const KKB = require('./kkb')
const app = new KKB()
app.use((req,res)=>{
  res.writeHead(200)
  res.end('kaikeba')
})
app.listen(3000,()=>{
  console.log('listen at 3000')
})
```

### 初步分析

**new KKB，则kkb.js中一定是返回了一个类，还要在kkb里实现app.js里调用的use和listen方法，在use方法中传入一个方法，指定KKB这个类中的this.callback为这个方法.在listen中执行这个方法，并传入req和res；并监听端口server.listen(...args)**

在kkb.js中

```
const http = require('http')
class KKB {
  listen(...args) {
    const server = http.createServer((req,res)=>{
      this.callback(req,res)
    })
    server.listen(...args)
  }
  use(callback){
    this.callback = callback
  }
}
module.exports = KKB
```

### context

**koa为了能够简化API，引入上下文context概念，将原始请求对象req和响应对象res封装并挂载到context上，并且在context上设置getter和setter，从而简化操作。**

#### getter和setter

在getter-setter.js中举例

```
const kaikeba = {
  info:{name:'kaikeba'},
  get name() {
    return this.info.name
  },
  set name(val){
    console.log('new name is' + val)
    this.info.name = val
  }
}
console.log(kaikeba.name)
kaikeba.name = 'kaikeba123'
console.log(kaikeba.name)

输出 kaikeba
  new name iskaikeba123
   kaikeba123

    
```

**如上文所示，如果封装一个context，原理是通过get和set操作request和response**

### 进一步实现功能（实现包装上下文context）

1.创建request.js和response.js,再合并到context.js

**2.在kkb.js中引入这三个文件，构建上下文函数createContext，以Object.create()的方式创建context、request、response，**

```
const context = require('./context')
const request = require('./request')
const response = require('./response')

createContext(req,res){
  const ctx = Object.create(context)
  ctx.request = Object.create(request)
  ctx.response = Object.create(response)
  // 把http的req和res赋值给ctx和request\response的req\res
  ctx.req = ctx.request.req = req
  ctx.res = ctx.response.res = res
  return ctx
}
```

#### 补充Object.create和new Object:

`object.create()` 是使用指定的原型`proto`对象及其属性`propertiesObject`去创建一个新的对象。

`proto` 是必填参数，**就是新创建出来的对象的原型** （新对象的 `__proto__`属性指向的对象），**值得注意的是当`proto`为`null`的时候创建的新对象完全是一个空对象，没有原型（图一）**，**也就是没有继承`Object.prototype`上的方法。（如`hasOwnProperty()``toString()` 等）**

![img](https://upload-images.jianshu.io/upload_images/2434303-4320cb893f7ab0d5.png?imageMogr2/auto-orient/strip|imageView2/2/w/234)

图1



- `propertiesObject`是可选参数，作用就是给新对象添加新属性以及描述器(图2)，具体可参考 [Object.defineProperties() - mdn](https://link.jianshu.com/?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) 的第二个参数。需要注意的是新添加的属性是新对象自身具有的属性也就是通过`hasOwnProperty()` 方法可以获取到的属性，而不是添加在原型对象里。（图3）

![img](https://upload-images.jianshu.io/upload_images/2434303-b7edb4c28d7b8538.png?imageMogr2/auto-orient/strip|imageView2/2/w/543)

图2



![img](https://upload-images.jianshu.io/upload_images/2434303-bb8fde939d887c32.png?imageMogr2/auto-orient/strip|imageView2/2/w/362)

图3

**new object()**

```
var test1 = {x:1};

var test2 = new Object(test1);

var test3 = Object.create(test1);
console.log(test3);//{} 
//test3等价于test5
var test4 = function(){
　　
}
test4.prototype = test1;
var test5 = new test4();
console.log(test5);
console.log(test5.__proto__ === test3.__proto__);//true
console.log(test2);//{x:1}
```

**总结：使用Object.create()是将对象继承到__proto__属性上**

**举例（重点）**

```
var test = Object.create({x:123,y:345});
console.log(test);//{}
console.log(test.x);//123
console.log(test.__proto__.x);//3
console.log(test.__proto__.x === test.x);//true

var test1 = new Object({x:123,y:345});
console.log(test1);//{x:123,y:345}
console.log(test1.x);//123
console.log(test1.__proto__.x);//undefined
console.log(test1.__proto__.x === test1.x);//false

var test2 = {x:123,y:345};
console.log(test2);//{x:123,y:345};
console.log(test2.x);//123
console.log(test2.__proto__.x);//undefined
console.log(test2.__proto__.x === test2.x);//false
```

3.在listen中构建上下文，并把req和res作为参数传进去

```
listen(...args) {
  const server = http.createServer((req,res)=>{
    //构建上下文
    const ctx = this.createContext(req.res)
    // this.callback(req,res)
    this.callback(ctx)
    res.end(ctx.body)
  })
  server.listen(...args)
}
```

4.在app.js中以context参数代替以前的req，res两个参数

```
// app.use((req,res)=>{
//   res.writeHead(200)
//   res.end('kaikeba')
// })
app.use(ctx=>{
  ctx.body = 'haha'
})
```

实现通过操纵context来操作



## 中间件

**Koa中间件机制：Koa中间件机制就是函数组合的概念，将一组需要顺序执行的函数复合为一个函数，外层函数的参数实际是内层函数的返回值。洋葱圈模型可以形象表示这种机制，是源码中的精髓和难点。**

#### 知识储备：compose

```
const compose = (fn1,fn2) => (...args) =>fn2(fn1(...args))
const add = (x,y) => x+y
const square = z => z*z
const fn = compose(add,square)
console.log(fn(1,2))
```

```
// 实现多函数嵌套
const compose = (...[first,...other]) => (...args) =>{
  let ret = first(...args)
  other.forEach(fn=>{
    ret = fn(ret)
  })
  return ret
}
```

**用reduce也可以实现**

#### 异步中间件：

目的

希望可以按顺序执行异步函数fn1,fn2,fn3，用compose合并实现

```
async function fn1(next){
  console.log('fn1')
  await next()
  console.log('end fn1')
}

async function fn2(next){
  console.log('fn2')
  await delay()
  await next()
  console.log('end fn2')
}

function fn3(next){
  console.log('fn3')
}

function delay(){
  return Promise.resolve(res => {
    setTimeout(() => reslove(),2000)
  })
}

const middlewares = [fn1,fn2,fn3]
const finalFn = compose(middlewares)
finalFn()
```

**为了实现按顺序的执行，我们要定义一个compose方法，参数接收一个数组**

```
function compose(middlewares) {
  return function () {
    // 执行第一个
    return dispatch(0)
    function dispatch(i) {
      let fn = middlewares[i]
      if(!fn){
        // 如果不是函数，说明空了，则返回一个空异步promise
        return Promise.resolve()
      }
      return Promise.resolve(
        fn(function next() {
        //  执行下一个
          console.log('下一个')
          return dispatch(i+1)
        })
      )
    }
  }
}
```

最后输出的日志为

fn1
下一个
fn2
下一个
fn3
end fn2
end fn1

实验成功后，将compose带入kkb.js中作为一个合成函数

**与实验版不同的是，要加入上下文参数**

```
 //   合成函数
compose(middlewares){
  // 传入上下文
  return function(ctx){
    return dispatch(0)
    function dispatch(i){
      let fn = middlewares[i]
      if(!fn){
        return Promise.resolve()
      }
      return Promise.resolve(
        fn(ctx,function next(){
          return dispatch(i + 1)
        })
      )
    }
  }
}
```

然后初始化中间件数组

```
// 初始化中间件数组
constructor() {
  this.middlewares = []
}
```

将createServer里的函数改成异步函数

最后在listen中实现中间件的合成（调用compose）

执行这个函数

```
listen(...args) {
  const server = http.createServer(async (req,res)=>{
    //构建上下文
    const ctx = this.createContext(req.res)
    //中间件合成
    const fn = this.compose(this.middlewares)
    await fn(ctx)
    // this.callback(req,res)
    // this.callback(ctx)
    res.end(ctx.body)
  })
  server.listen(...args)
```

use中加入中间件

```
use(middleware) {
  this.middlewares.push(middleware)
}
```

## 路由

见router.js

原理就是把所有的get/post。。等请求的路径都先存入一个数组中

并封装一个routes中间件进行匹配

在app.js中使用

```
const Router = require('./router')
const router = new Router()

router.get('/index', async ctx => { ctx.body = 'index page'; });
router.get('/post', async ctx => { ctx.body = 'post page'; });
router.get('/list', async ctx => { ctx.body = 'list page'; });
router.post('/index', async ctx => { ctx.body = 'post page'; });

// 路由实例输出父中间件 router.routes()
app.use(router.routes());
```

## 静态资源static

见static.js

默认读取public文件夹下的内容

```
const static = require('./static')
app.use(static(__dirname + '/public'));
```

然后在网址上输入

> http://localhost:3000/public/login.html

会显示public目录下login.html的内容