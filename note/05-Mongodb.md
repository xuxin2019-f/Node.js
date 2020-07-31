# egg-mongoose用法

https://www.cnblogs.com/wxw1314/p/10339775.html

# Mongodb

## 连接池native

**数据库连接池负责分配、管理和释放数据库连接，它允许应用程序重复使用一个现有的数据库连接，而不是再重新建立一个；**释放空闲时间超过最大的空闲时间的数据库连接来避免因为没有释放数据库连接而引起的数据库连接遗漏。这项技术能明显提高对数据库操作的性能

**通俗的讲，如果网站很多人访问，数据库频繁连接关闭很消耗资源，所以有一个连接池来管理这些连接**

mysql的sequelize默认有连接池，可以直接在建立连接的时候优化连接池

```
// 建立连接
const sequelize = new Sequelize("kaikeba", "root", "example", {
    host: "localhost",
    dialect: "mysql",
    // operatorsAliases: false,
    pool: {
        max: 10,
        min: 0,
        idle: 30000
    }
});
```

## mongodb的安装配置

![mongodb](F:\图片\mongodb.png)

见pdf

**注意：mongodb不用建表**

## mongodb原生驱动

见pdf

启动：命令行工具运行net start MongoDB

#### 案例：瓜果超市

**1.在mongodb中创建models文件夹，创建conf.js来专门暴露数据库配置**

```
module.exports = {
  url:'mongodb://localhost:27017',
  dbName:'test'
}
```

**2.创建db.js来操作数据库**

```
const conf = require('./conf')
const EventEmitter = require('events').EventEmitter

// 建立客户端
const MongoClient = require('mongodb').MongoClient

class Mongodb{
  constructor(conf) {
    // 保存
    this.conf = conf
    this.emmiter = new EventEmitter()

    // 建立数据连接
    this.client = new MongoClient(conf.url,{
      useNewUrlParser:true
    })

    this.client.connect(err => {
      if(err) throw err
      console.log('连接成功')
      // 发射一个connect事件
      this.emmiter.emit('connect')
    })
  }
  // 执行
  col(colName,dbName = conf.dbName) {
    return this.client.db(dbName).collection(colName)
  }

  // 把event和cb绑定,如果监听到event事件，则执行cb回调函数
  once(event,cb){
    this.emmiter.once(event,cb)
  }
}
module.exports = new Mongodb(conf)
```

**3.了解eventEmitter**

最后的结果就是每秒都打印一个数值

```
const EventEmitter = require('events').EventEmitter; 
const event = new EventEmitter(); 
// 接受事件，一监听到事件则触发回调
event.on('some_event', num =>  { 
    console.log('some_event 事件触发:'+num); 
}); 
let num = 0
setInterval(() =>  { 
    // 抛出事件
    event.emit('some_event' , num ++ ); 
}, 1000); 
```

**4.初始化数据：实现像数据库插入一百条数据，创建initData.js**

```
const mongodb = require('./models/db')
mongodb.once('connect', async () => {
  const col = mongodb.col('fruits')
  // 删除已存在
  await col.deleteMany()
  const data = new Array(100).fill().map((v, i) => {
    return { name: "XXX" + i, price: i, category: Math.random() > 0.5 ? '蔬菜' : '水果' }
  })

  // 插入
  await col.insertMany(data)
  console.log("插入测试数据成功")
})
```

**总结**

在db.js中创建一个类，把从conf.js中引入的配置导入。并利用emmiter实现在数据库一连接的情况下就发射一个connect事件

在initData中，调用了db.js中的once方法，这个方法一旦监听到connect事件，就执行下面的异步操作，即数据库一旦连接就执行回调操作：调用db.js中的col方法来操作fruits集合，最后插入数据

5.前端调用页面index.html

6.接口编写：index.js

```
const express = require("express")
const app = express()
const path = require('path')
const mongo = require("./models/db")
// const testdata = require("./initData")

app.get("/", (req, res) => {
    res.sendFile(path.resolve("./index.html"))
})

app.get("/api/list", async (req, res) => {
    // 分页查询
    const { page} = req.query
    try {
        // 切换到fruits集合
        const col = mongo.col("fruits")
        // 总数量
        const total = await col.find().count()
        const fruits = await col
            .find()
            .skip((page - 1) * 5)// 比如在第二页，则跳过第一页的五条
            .limit(5)// 每页限制五条
            .toArray()
        res.json({ ok: 1, data: { fruits, pagination: { total, page } } })
    } catch (error) {
        console.log(error)
    }
})

app.get("/api/category", async (req, res) => {
    const col = mongo.col("fruits")
    const data = await col.distinct('category')
    res.json({ ok: 1, data })
})

app.listen(3000)
```



## ODM-Mongoose第三方包

- 概述：优雅的NodeJS对象文档模型object document model。

Mongoose两个特点

1.  通过关系型数据库的思想来设计非关系型数据库

```
const Schema = mongoose.Schema({
  category: String,
  name: String
});
```

1. 基于mongodb驱动，简化操作



#### 步骤

##### 1.连接

```js
const mongoose = require('mongose')

mongoose.connect('mongodb://localhost:27017/test(数据库名)',{useNewUrlParser:true},error=>{
    if(error){
        console.log(error)
        throw error
    }else{
        console.log('connection successful')
    }
})

```

##### 2.创建集合

创建集合分为两步，一是对**对集合设定规则**，二是**创建集合**，创建mongoose.Schema构造函数的实例即可创建集合

```js
// 定义集合规则
const Schema = new mongoose.Schema({
 category:String,
 name:String
})

// 创建集合并应用规则,编译一个Model，它对应数据库中复数、小写的collection
const Model = mongoose.model('fruit',Schema)
```

##### 3.创建文档

创建文档实际上就是**向集合中插入数据**

```
// 4.创建，create返回Promise
let r = await Model.create({
  category: "温带水果",
  name: "苹果",
  price: 5
});
console.log("插入数据:", r);
```

##### 4.查询

**注意，find查出来的是一个数组，findOne查出来的是单独的一个对象**

```js
//5.查询，find返回Query，它实现了then和catch，可以当Promise使用
//如果需要返回Promise，调用其exec()
r = await Model.find({ name: "苹果" });
console.log("查询结果:", r);

全局查询直接find({})
```

```
// 根据条件查找文档

Course.findOne({name: 'node.js基础'}).then(result => console.log(result))
```

![mongodb查询文档](F:\图片\mongodb查询文档.png)

注意这里sort默认是从小到大排序

对MongoDB的查询文档进行排序，要使用`sort()`方法。`sort()`方法接受一个文档，其中包含的排序的字段，及要指定排序方式。**排序方式为可选值为：`1`和`-1`，`1`表示使用升序排列，`-1`表示降序排序。**

`sort()`语法结构

```
db.COLLECTION_NAME.find().sort({KEY:1})
```

如：

```js
//按照views降序排列
let sort = await ctx.model.Article.find()
      .sort({ views: -1 })
      .then((data) => {
        console.log('排序', data)
      })
```



##### 5.更新

```
// 6.更新，updateOne返回Query
// 1.更新单个
r = await Model.updateOne({ name: "苹果" }, { $set: { name: '芒果' } });
console.log("更新结果：", r);

// 2.更新多个
r = await Model.updateMany....

//mongoose中
Model.update({xxx},{$set:{xxx}})
```

##### 6.删除

```js
// 7.删除，deleteOne返回Query
// 1.删除单个
r = await Model.deleteOne({ name: "苹果" });
console.log("删除结果：", r);

// 2.删除多个
deleteMany

//根据id删除
注意，如果是通过路径传递过来的ctx.params.id，这个id的类型是字符串类型的：
r = await Model.deleteOne({"_id":ctx.params.id})

mongoose中：
//全部删除
Model.remove({})
//删除某个
Model.remove({条件},function(err,data){})
```

##### 7.mongoose验证

在创建集合规则时，可以设置当前字段的验证规则，验证失败就则输入插入失败。

> required: true 必传字段
>
> minlength：3 字符串最小长度
>
> maxlength: 20 字符串最大长度
>
> min: 2 数值最小为2
>
> max: 100 数值最大为100
>
> enum: ['html'**,** 'css'**,** 'javascript'**,** 'node.js']
>
> trim: true 去除字符串两边的空格
>
> validate: 自定义验证器
>
> default: 默认值

```
const blogSchema = mongoose.Schema({
  title: { type: String, required: [true, '标题为必填项'] }, // 定义校验规则
  author: String,
  body: String,
  comments: [{ body: String, date: Date }], // 定义对象数组
  date: { type: Date, default: Date.now }, // 指定默认值
  hidden: Boolean,
  meta: {
    // 定义对象
    votes: Number,
    favs: Number
  }
})
```

##### 8.集合关联

通常**不同集合的数据之间是有关系的**，例如文章信息和用户信息存储在不同集合中，但文章是某个用户发表的，要查询文章的所有信息包括发表用户，就需要用到集合关联。

1.使用id对集合进行关联

2.使用populate方法进行关联集合查询

```js
// 用户集合
const User = mongoose.model('User', new mongoose.Schema({ name: { type: String } })); 
// 文章集合
const Post = mongoose.model('Post', new mongoose.Schema({
    title: { type: String },
    // 使用ID将文章集合和作者集合进行关联
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));
//联合查询，拿到某个文章的用户信息？
Post.find()
      .populate('author')
      .then((err, result) => console.log(result));

```

比如MyProject中：

![mongoose1](F:\图片\mongoose1.png)

![mongoose2](F:\图片\mongoose2.png)

## keystonejs

**实现无代码的增删改查，即前端的连接可以直接操作数据库的操作，例如在postman中，直接向某个路由实现post请求，利用keystone直接在后台添加数据**

**架构思路见restful文件夹**

### 1.在conf.js中暴露数据库地址

```
module.exports = {
  db:{
    url:'mongodb://localhost:27017/test',
    options:{useNewUrlParser:true}
  }
}
```

### 2.创建model文件夹，用于创建模型

 创建user.js,来构造一个集合规则

```
module.exports = {
  schema: {
    mobile: { type: String, required: true },
    realName: { type: String, required: true }
  }
}
```

### 3.创建framework文件夹执行工作

#### （1）创建loader.js

在其中创建load函数来获取路径，执行回调

```
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

function load(dir,cb) {
  // 获取绝对路径
  const url = path.resolve(__dirname,dir)
  const files = fs.readdirSync(url)
  files.forEach(filename =>{
    //去掉后缀
    filename = filename.replace('.js','')
    // 导入文件
    const file = require(url + '/' +filename)
    // 处理
    cb(filename,file)
  })
}
```

- 定义loadModel来建立数据库连接，并把所有所需要的的schema自动挂载到$model这个对象上，调用load方法

```
// 建立数据库连接，并把所有所需要的的schema自动挂载到$Model这个对象上
const loadModel = config =>app =>{
  mongoose.connect(config.db.url,config.db.options)
  const conn = mongoose.connection
  conn.on('error',()=>console.error('数据库连接失败'))
  // 初始化
  app.$model = {}
  // 调用load方法
  load('../model',(filename,{schema})=>{
    console.log('load model:'+filename,schema)
    app.$model[filename] = mongoose.model(filename,schema)
  })
}
```

- 暴露loadModel

```
module.exports = {
  loadModel
}
```

#### （2）创建router.js

```
const router = require('koa-router')()
const {
  init, get, create, update, del,
} = require('./api')
// 利用两个中间件操作，init实现根据list名字加载对象
router.get('/api/:list', init, get)
router.post('/api/:list', init,create)
router.put('/api/:list/:id', init, update)
router.delete('/api/:list/:id', init, del)

module.exports = router.routes()
```

#### (3)创建api.js实现函数init、get、create、update、del等

```
module.exports = {
  async init(ctx,next){
    console.log(ctx.params)
    const model = ctx.app.$model[ctx.params.list]
    if(model){
      ctx.list = model
      await next()
    }else {
      ctx.body = 'no this model'
    }
  },
  async get(ctx) {
    // 查询
    ctx.body = await ctx.list.find({})
  },
  async create(ctx) {
  // 对应post
    const res = await ctx.list.create(ctx.request.body)
    ctx.body = res
  },
  async update(ctx) {
  // 对应put
    const res = await ctx.list.updateOne({ _id: ctx.params.id }, ctx.request.body)
    ctx.body = res
  },
  async del(ctx) {
  // 对应delete
    const res = await ctx.list.deleteOne({ _id: ctx.params.id })
    ctx.body = res
  }
}
```

#### 4.创建index.js实现端口

```
const Koa = require('koa')
const app = new Koa()
const restful = require('./framework/router')
const bodyParser = require('koa-bodyparser')
const config = require('./conf')
const {loadModel} = require('./framework/loader')

// 初始化数据库
loadModel(config)(app)

app.use(bodyParser())
app.use(require('koa-static')(__dirname + '/'))
app.use(restful)

const post = 3000
app.listen(post,()=>{
  console.log(`app start at port ${post}`)
})
```

最终效果

在postman中任意操作数据，实现操纵数据库

