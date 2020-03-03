# Koa鉴权

## 1.session-cookie方式

见pdf

原理

> 1.服务器在接受客户端首次访问时在服务器端创建seesion，然后保存seesion(我们可以将seesion保存在内存中，也可以保存在redis中，推荐使用后者)，然后给这个session生成一个唯一的标识字符串,然后在响应头中种下这个唯一标识字符串。
> 2.签名。这一步通过秘钥对sid进行签名处理，避免客户端修改sid。（非必需步骤）
> 3.浏览器中收到请求响应的时候会解析响应头，然后将sid保存在本地cookie中，浏览器在下次http请求的请求头中会带上该域名下的cookie信息，
> 4.服务器在接受客户端请求时会去解析请求头cookie中的sid，然后根据这个sid去找服务器端保存的该客户端的session，然后判断该请求是否合法。

## 2.koa中session的使用

### 1.安装

npm i kos-session -S

### 2.创建app.js

**其中app.keys对于加密函数来说是必要的，相当于哈希算法里的秘钥。对应的是配置项中的signed签名**

**如果将signed设置为false，则cookie中只有一个随机生成且固定的kkb:sess,这是可以被反推的，不安全；而如果设置签名，则还多一个kkb:sess.sig签名，这个运用了哈希算法，更安全**

#### 哈希

​      把一个不固定长内容翻译成一个固定长内容，它是一种摘要算法（这个摘要是有一定规则的），且可以加入秘钥来进行计算。

> 例：夏老师 + 摘要算法  => X3L3S3 => 秘钥（这里假设是123） => X4L5S6

​    哈希还支持雪崩效应： 即变化后很相似的，它的加密密文会发生剧烈变化

> 从XLS=>YLS,  不会显示YLS这个密文，而是发生剧烈变化，比如ABL

如果不添加app.keys，报错：

![keys](F:\图片\keys.png)

```
const Koa = require('koa')
const app = new Koa()
const session = require('koa-session')

// 用于在node体系里如果使用了加密函数，即下面配置项的signed，则需要keys，由于koa-session中经历了加密，所以设置前面keys
// 用来对cookie进行前面
app.keys = ['somwewnidx']// 秘钥

// 配置项
const SESS_CONFIG = {
  key: 'kkb:sess', // cookie键名
  maxAge: 8640000, // 有效期
  httpOnly: true, // 服务器有效
  signed: true // 签名
  //store: redisStore({ client })
}

// 注册,用这个中间件，以后就可以通过context.session获取和操作session
app.use(session(SESS_CONFIG,app))

// 测试
app.use(ctx => {
  if(ctx.path === '/favicon.ico') return;
  // 获取
  let n = ctx.session.count || 0;
  // 设置
  ctx.session.count = ++n
  ctx.body = `第${n}次访问`
})

app.listen(3000,()=>{
  console.log('ok')
})
```

### 3.效果

![keys2](F:\图片\keys2.png)

### 4.redis实现多机存储

见pdf

### 5.session-cookie鉴权例子

见pdf





## 3.Token（重要）

session不足，见pdf

### 1.原理

1.客户端使用用户名跟密码请求登录
2.服务端收到请求，去验证用户名与密码
3.验证成功后，服务端会签发一个令牌(Token)，再把这个Token发送给客户端
4.**客户端收到Token以后可以把它存储起来，比如放在Cookie里或者LocalStorage里**

```
async login() {
  const res = await axios.post("/login-token", {
    username: this.username,
    password: this.password
  });
  localStorage.setItem("token", res.data.token);
},
async logout() {
  localStorage.removeItem("token");
},
```

5.客户端每次向服务端请求资源的时候需要带着服务端签发的Token
6.服务端收到请求，然后去验证客户端请求里面带着的Token，如果验证成功，就向客户端返回请求的数据

```
axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem("token");
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      // Bearer是JWT的认证头部信息
      config.headers.common["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
```

### 2.代码演示

见pdf

### 3.JWT（JSON WEB TOKEN)

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiYWJjIiwicGFzc3dvcmQiOiIxMTExMTEifSwiZXhwIjoxNTU3MTU1NzMwLCJpYXQiOjE1NTcxNTIxMzB9.pjGaxzX2srG_MEZizzmFEy7JM3t8tjkiu3yULgzFwUk

由三部分组成：令牌，payload，哈希

**前两部分**由base64编码，是可逆的，可以被反推

**第三部分**再使用hs256算法利用秘钥来对前两部分进行哈希算法，**作用是反篡改**

解码见pdf

## 4.OAuth（第三方鉴权）

概述：三方登入主要基于OAuth 2.0。OAuth协议为用户资源的授权提供了一个安全的、开放而又简易的标准。与以往的授权方式不同之处是OAUTH的授权不会使第三方触及到用户的帐号信息（如用户名与密码），即第三方无需使用用户的用户名与密码就可以申请获得该用户资源的授权，因此OAUTH是安全的。

### 例子：实现github登录跳转

在github页面找到settings->development settings进行配置

**设置app名字，homepage地址以及回调地址**

![oauth](F:\图片\oauth.png)

这样就注册好了一个oAuth服务

原理：

![oauth-github](F:\图片\oauth-github.jpg)

实现

点击页面跳转链接

![1](F:\图片\1.png)

见oauth-simple

## 5.SSO单点登录（了解）