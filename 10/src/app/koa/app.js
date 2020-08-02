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
