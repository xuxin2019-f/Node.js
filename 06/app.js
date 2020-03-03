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
