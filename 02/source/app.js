const KKB = require('./kkb')
const app = new KKB()
// app.use((req,res)=>{
//   res.writeHead(200)
//   res.end('kaikeba')
// })
// app.use(ctx=>{
//   ctx.body = 'haha'
// })

// const delay = () => Promise.resolve(resolve => setTimeout(() => resolve(), 2000));
// app.use(async (ctx, next) => {
//     ctx.body = "1";
//     await next();
//     ctx.body += "5";
// });
//
// app.use(async (ctx, next) => {
//     ctx.body += "2";
//     await delay();
//     await next();
//     ctx.body += "4";
// });
//
// app.use(async (ctx, next) => {
//     ctx.body += "3";
// });
const static = require('./static')
app.use(static(__dirname + '/public'));

const Router = require('./router')
const router = new Router()

router.get('/index', async ctx => { ctx.body = 'index page'; });
router.get('/post', async ctx => { ctx.body = 'post page'; });
router.get('/list', async ctx => { ctx.body = 'list page'; });
router.post('/index', async ctx => { ctx.body = 'post page'; });

// 路由实例输出父中间件 router.routes()
app.use(router.routes());

app.listen(3000,()=>{
  console.log('listen at 3000')
})
