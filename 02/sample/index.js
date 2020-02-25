const Koa = require('koa')
const app = new Koa()
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
app.listen(3000)
