# 1.创建项目

步骤见pdf

# 2.创建Controller方法

创建user.js

```
const Controller = require('egg').Controller
/**
 * @Controller 用户管理
 */
class UserController extends Controller {
  constructor(ctx){
    super(ctx)
  }

  /**
   * @summary 创建用户
   * @description 创建用户  记录用户账户/密码/类型
   * @router post /api/user
   * @request body createUserRequest *body
   * @response 200 baseResponse 创建成功
   */
  async create(){
    const {ctx} = this
    ctx.body = 'user Ctrl'
  }
}
```

**其中以注释的方法来配置接口和路由规则，这需要导入插件**

# 3.建立contract文件夹

## （1）建立index.js来实现baseRequest和baseResponse

```
module.exports = {
  baseRequest:{
    id: { type: 'string', description: 'id 唯一键' ,required:true,example:'1'},

  },
  baseResponse: {
    code: { type: 'integer', required: true, example: 0 },
    data:{type: 'string',example: '请求成功' },
    errorMessage: { type: 'string', example: '请求成功' },
  },
};
```

## （2）建立user.js来实现createUserRequest

```
module.exports = {
    createUserRequest: {
        mobile: { type: 'string', required: true, description: '手机号', example: '18801731528', format: /^1[34578]\d{9}$/, },
        password: { type: 'string', required: true, description: '密码', example: '111111', },
        realName: { type: 'string', required: true, description: '姓名', example: 'Tom' },
    },
}
```

# 4.实现读取并操作注释内容（安装插件的方法）

## （1)安装swagger插件

npm install egg-swagger-doc-feat -s

## （2）配置

在config/plugin下配置

```
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc-feat',
  }
};
```

在config/config.default.js下具体配置

**将 routerMap设置成true后，能实现即使不在router.js里配置相关路由，也可以通过controller里的yaml注释来自动完成路由的配置**

```
config.swaggerdoc = {
  // 设置扫描的目录是在app下的controller
  dirScanner: './app/controller',
  // 文档的定义
  apiInfo: {
    title: '开课吧接口',
    description: '开课吧接口 swagger-ui for egg',
    version: '1.0.0',
  },
  // 文档的协议
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  enableSecurity: false,
  // enableValidate: true,
  routerMap: true, 
  enable: true,
}
```

实验：

npm run dev后

在网址上输入：http://127.0.0.1:7003/swagger-ui.html

进入swagger插件的管理页面

![swagger](F:\图片\swagger.png)

可以测试接口



# 5.增加异常处理中间件

- 异常同意处理
- 开发环境返回详细异常信息
- 生产环境不返回详细信息

## 在app下创建middleware文件夹，在下面创建error_handler.js

```
// /middleware/error_handler.js
'use strict'
module.exports = (option, app) => {
  return async function (ctx, next) {
    try {
      await next()
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this)
      const status = err.status || 500
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && app.config.env === 'prod' ?
        'Internal Server Error' :
        err.message
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        code: status, // 服务端自身的处理逻辑错误(包含框架错误500 及 自定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
        error: error
      }
      if (status === 422) {
        ctx.body.detail = err.errors
      }
      ctx.status = 200
    }
  }
}
```

## 然后在config.default.js中配置

```
config.middleware = ['errorHandler']
```

在postman中实验post请求，实现返回500状态码，并返回错误信息







# 6.利用helper方法实现统一响应格式（这是一种约定）

它的作用在于我们可以将一些常用的动作抽离在helper.js里面成为一个独立的函数，这样可以用JavaScript来写复杂的逻辑，避免逻辑分散各处。另外还有一个好处是Helper这样一个简单的函数，可以让我们更容易编写测试用例。
框架内置了一些常用的Helper函数。我们也可以编写自定义的Helper函数。

## 建立extend文件夹，在下面建立helper.js

```
const moment = require('moment')

// 处理成功响应 形成统一应答
exports.success = ({ ctx, res = null, msg = '处理成功' }) => {
  ctx.body = {
    code: 0,
    data: res,
    msg
  }
  ctx.status = 200
}

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss')
```

## 这样在controller下的user.js中调用：

```
async create(){
  const {ctx} = this
  const res = {abc:123}
  // 设置应答内容
  ctx.helper.success({ctx,res})
}
```

在postman中实验结果是：

{

  "code": 0,

  "data": {

​    "abc": 123

  },

  "msg": "处理成功"

}





# 7.实现校验

npm i egg-validate -S

然后在plugin中增加配置

```
validate:{
enable:true,
package:'egg-validate',
},
```

在controller下的user.js中

```
async create(){
  const {ctx} = this
  // 校验参数  egg会把contract中导出的所有东西放在ctx.rule下
  ctx.validate(ctx.rule.createUserRequest)
  const res = {abc:123}
  // 设置应答内容
  ctx.helper.success({ctx,res})
}
```

在postman中测试错误格式：

响应结果为

> {
>
>   "code": 422,
>
>   "error": "Validation Failed",
>
>   "detail": [
>
> ​    {
>
> ​      "message": "should match /^1[34578]\\d{9}$/",
>
> ​      "code": "invalid",
>
> ​      "field": "mobile"
>
> ​    },
>
> ​    {
>
> ​      "message": "required",
>
> ​      "field": "password",
>
> ​      "code": "missing_field"
>
> ​    }
>
>   ]
>
> }

