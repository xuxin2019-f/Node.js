# eggjs

### 概念

是阿里基于koa的一个框架

### 安装

 npm i egg-init -g

​             egg-init egg --type=simpel

   然后自动生成egg文件夹

​             cd egg-example

​             npm i

###      启动

​                 npm run dev

​                 open localhost:7001

​     **默认没有入口文件，但在app文件夹下的router.js中，以一种约定的方式，约定规定路由的加载页写在app=》controller下的js文件夹下**

 例如：

```
  router.get('/', controller.home.index);
```

**则其显示的页面写在了app->controller->home.js下，且controller不需要导出引入**

仿写：

```
router.get('/user',controller.user.index)
```

 在controller文件夹下新建user.js

```
const Controller = require('egg').Controller;
class userController extends Controller {
  async index() {
    this.ctx.body = {
      name:'tom'
    }
  }
}
module.exports = userController
```

### app下的结构

#### 1.controller 门户层

#### 2.service逻辑层

  试验：

在service下建立user.js（**控制器**）

```
const Service = require('egg').Service

class UserService extends Service{
  async getAll() {
    return [
      {name:'jerry'}
    ]
  }
}
module.exports = UserService
```

在controller下的user.js调用

```
class userController extends Controller {
  async index() {
    // this.ctx.body = {
    //   name:'tom'
    // }
    const {ctx} = this
    ctx.body = await ctx.service.user.getAll()
  }
}
module.exports = userController
```

#### 3.model模型层

以mysql+sequelize为例

见pdf

在model中建立user.js来定义集合和操作数据库





# egg原理解析

建立kgg文件夹

routes文件夹下的index.js