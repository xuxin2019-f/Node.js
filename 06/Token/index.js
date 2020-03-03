const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const app = new Koa();
const jwt = require("jsonwebtoken");
const jwtAuth = require("koa-jwt");

// 秘钥
const secret = "it's a secret";
app.use(bodyParser())
app.use(static(__dirname + '/'));

// 1.这里是前端login登录请求的后端代码，产生了一个token
router.post("/login-token", async ctx => {
  const { body } = ctx.request;
  //登录逻辑，略
  //设置session
  const userinfo = body.username;
  ctx.body = {
    message: "登录成功",
    user: userinfo,
    // 生成 token签名 返回给客户端
    token: jwt.sign(
      {
        data: userinfo,
        // 设置 token 过期时间，一小时后，秒为单位
        exp: Math.floor(Date.now() / 1000) + 60 * 60
      },
      secret
    )
  };
});

router.get(
  "/getUser-token",
  // 2.鉴权。使用这个中间件来检查功能之前设置的签名是否合法，合法才执行下面的异步操作
  jwtAuth({
    secret
  }),
  async ctx => {
    // 验证通过，state.user
    console.log(ctx.state.user);

    //获取session
    ctx.body = {
      message: "获取数据成功",
      userinfo: ctx.state.user.data
    };
  }
)

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000)
