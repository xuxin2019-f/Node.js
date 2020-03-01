# mysql

**首先看pdf安装了mysql和mysql workbench**

在后端安装**mysql2**,有mysql这个库，但是用mysql2中的promise可以实现异步执行

```
npm i mysql2 --save
```

在mysql workbench中新建一个数据库名为kaikeba

在mysql workbench中重置root 的密码，并将这个用户连接在kaikeba这个数据库上

### 在node中连接

```
(async ()=>{
    // 实际上有mysql这个库，但这里用mysql2这个库里的promise方法，就可以把所有代码写成异步的了
    const mysql = require('mysql2/promise')
    // 连接配置
    const cfg = {
       host:'localhost',
       user:'root',
       password:'DAxuxin0727/',
       database:'kaikeba'
    }
    const connection = await mysql.createConnection(cfg)
    console.log('连接成功')
    }
    )()
```

在SCHEMAS空白处右键选择create schema

### 在node中来创建表并连接

```
// 创建table表 如果不存在test这个名字的表，则创建一个，设置id、message
const CREATE_SQL = `CREATE TABLE IF NOT EXISTS test (
                       id INT NOT NULL AUTO_INCREMENT,
                       message VARCHAR(45) NULL,
                       PRIMARY KEY (id))`
// execute表示执行
let ret = await connection.execute(CREATE_SQL)
console.log('create:',ret)
```

### 在表中插入参数

```
// 向test表中插入参数
const INSERT_SQL = `INSERT INTO test(message) VALUES(?)`
ret = await connection.execute(INSERT_SQL,['abc'])
console.log('insert1:',ret)
```

如果打印台中的affectedRows为1，说明插入成功

>  ResultSetHeader {
>     fieldCount: 0,
>     affectedRows: 1,
>     insertId: 2,
>     info: '',
>     serverStatus: 2,
>     warningStatus: 0
>   },

在mysql workbench中检查插入的参数

在Schemas中选择kaikeba下面的Tables下的test库，鼠标悬浮到最右侧的小图标，点击来查看数据

![mysql](F:\图片\mysql.png)

**如果想要修改，比如删除，右键选择delete Rows后，要点apply！！不然会报错**

### 实现查询

```
// 查询
const SELECT_SQL = `SELECT * FROM test`
ret = await connection.execute(SELECT_SQL)
// 解构赋值，rows是数据，fields是mantadata
const [rows,fields] = ret
console.log('rows',JSON.stringify(rows))
```





## ORM - Sequelize

**一个数据库中间件，不需要直接去操纵数据库了**

概述：基于Promise的ORM(Object Relation Mapping)，支持多种数据库、事务、关联等，实现像操作对象一样来操作数据库（mongodb直接就是对象，更方便）

### 安装

```
npm i sequelize mysql2 -S
```

```
(async ()=>{
  const Sequelize = require('sequelize')

  // 建立连接
  const sequelize = new Sequelize('kaikeba','root','DAxuxin0727/',{
    host:'localhost',
    dialect:'mysql'
  })

  // 定义模型
  const Fruit = sequelize.define('Fruit',{
    name:{type:Sequelize.STRING(20), allowNull: false},
    price:{type:Sequelize.FLOAT, allowNull: false},
    stock:{type:Sequelize.INTEGER, defaultValue:0}
  })

  // 同步数据库
  let ret = await Fruit.sync()
})()
```

终端自动为我们实现，**即我们不再需要自己建表了**

![sequelize](F:\图片\sequelize.png)

刷新数据库，实现了fruits数据库



### 基本操作

#### 插入

```
// 插入
// ret = await  Fruit.create({
//   name:'香蕉',
//   price:3.5
// })
// console.log('create:',ret)
```

当创建了各个数据库的依赖之后，直接通过如

user.createProduct(..)的方法来创建即可

#### 更新

1. 方式一

```
// 更新操作
ret = await Fruit.update({price:4},{
  where:{
    name:'香蕉'
  }
})
```

  2.方式二

```
 Fruit.findById(1).then(fruit=>{
    // 现在通过id查询不支持了，用findByPk了
    fruit.price = 4
    fruit.save().then(()=>console.log....)
 })
```



#### 查询

```
// 查询
ret = await Fruit.findAll()
// 让查询结果更美观
console.log('find:',JSON.stringify(ret,'','\t'))

 // 条件查询
 1.通过查询操作符查询全部
const Op = Sequelize.Op
ret = await  Fruit.findAll({
    // 长度在2-4之间
    where:{price:{[Op.lt]:4,[Op.gt]:2}}
  })
  
 2.通过属性查询一个
 Fruit.findOne({where:{name:"香蕉"}}).then(fruit=>{
   // fruit是首个匹配项，若没有则为null，用get方法来获取数据
    console.log(fruit.get())
 })
 
 3.指定查询字段
 Fruit.findOne({attributes:['name']}).then(fruit=>{
//fruit是首个匹配项，若没有则为null
   console.log(fruit.get());
});


 4.获取数据和总条数
Fruit.findAndCountAll().then(result=>{
      console.log(result.count);
      console.log(result.rows.length);
   });

```

**当创建了数据库依赖时，可以直接通过如下语句获取**

```
const products = await cart.getProducts({
  where: {
    id: prodId
  }
});
```

#### 删除

1. 方式一

```
Fruit.findOne({where:{id:1}}).then(r=>r.destroy());
```

​    2.方式二

```
Fruit.destroy({where:{id:1}}).then(r=>console.log(r));
```

#### 校验

可以通过校验功能验证模型字段格式、内容，校验会在、和时自动运行

```
price:{
    validate:{
      isFloat:{msg:"价格字段请输入数字"},
      min:{args:[0],msg:"价格字段必须大于0"}
    }
},
stock:{
    validate:{
    isNumeric:{msg:"库存字段请输入数字"}
    }
}
```



#### 强制同步

此时同一个插入语句不会造成每次更新都插入一个重复的数据，**避免自增**

```
let ret = await Fruit.sync({force:true})
```

#### 避免自动生成时间戳字段

```
// 定义模型
const Fruit = sequelize.define('Fruit',{
  name:{type:Sequelize.STRING(20), allowNull: false},
  price:{type:Sequelize.FLOAT, allowNull: false},
  stock:{type:Sequelize.INTEGER, defaultValue:0}
},{
  timestamps:false
})
```

#### 指定表名

```
// 定义模型
const Fruit = sequelize.define('Fruit',{
  name:{type:Sequelize.STRING(20), allowNull: false},
  price:{type:Sequelize.FLOAT, allowNull: false},
  stock:{type:Sequelize.INTEGER, defaultValue:0}
},{
  timestamps:false,
  // 指定表名
  tableName:'TBL_FRUIT'
})
```

此时在workbench里，出现了新的表

![fruittab](F:\图片\fruittab.png)

#### 解决自增的办法

1. 使用force:true,强制更新
2. 使用UUID

```
// 定义模型
const Fruit = sequelize.define('Fruit',{
  id:{
     type:Sequelize.DataTypes.UUID,
     defaultValue:Sequelize.DataTypes.UUIDV1,
     primaryKey:true
  },
  name:{type:Sequelize.STRING(20), allowNull: false},
  price:{type:Sequelize.FLOAT, allowNull: false},
  stock:{type:Sequelize.INTEGER, defaultValue:0}
},{
  timestamps:false,
  // 指定表名
  tableName:'TBL_FRUIT'
})
```

设置了id每次都为不同的UUID格式，这样即使不强制更新，每次的id值也不同



## 实战

创建文件夹shop

### 后端

**见backend**

见pdf实体关系图和与域模型ERD

![mysql实体关系](F:\图片\mysql实体关系.png)

展现了各个库之间的关系

users：用户

carts:购物车

一个用户可以有多个购物车

由于购物车和商品是多对多的关系，不能直接关联，建立一个cartitems中间表，形成映射

由于订单和商品是多对多的关系，不能直接关联，建立一个orderitems中间表，

形成映射

步骤

1. 初始化数据库

   ```
   const Koa = require('koa')
   const app = new Koa()
   const bodyParser = require('koa-bodyparser')
   app.use(require('koa-static')(__dirname + '/'))
   app.use(bodyParser())
   
   // 初始化数据库
   const sequelize = require('./util/database');
   const Product = require('./models/product');
   const User = require('./models/user');
   const Cart = require('./models/cart');
   const CartItem = require('./models/cart-item');
   const Order = require('./models/order');
   const OrderItem = require('./models/order-item');
   ```

   2.确立数据库关系（即表和表的关系）

```
// 创建数据库依赖
Product.belongsTo(User, {
  constraints: true,
  // 如果用户购物车里只有一个商品，则不允许被删除
  onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {
  // 定义cart和product是一对多的关系，并描述了中间表CartItem
  through: CartItem
});
Product.belongsToMany(Cart, {
  through: CartItem
});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {
  through: OrderItem
});
Product.belongsToMany(Order, {
  through: OrderItem
});
```

3.同步连接数据库，并创建用户

```
sequelize.sync().then(
  async result =>{
    // 创建用户
    let user = await User.findByPk(1)
    if(!user) {
      user = await  User.create({
        name:'xuxin',
        email:'xia@adf.com'
      })
      // 由于上面已经描述了user和cart的关系，则会自动为user提供这个创建cart的方法
      await user.createCart()
    }
    app.listen(3000,()=>{
      console.log('Listen at 3000')
    })
  }
)
```

4.鉴权

```
app.use(async (ctx,next)=>{
  // 找到第一个用户
  const user = await User.findByPk(1)
  ctx.user = user
  await next()
})
```

5.实现前端点击跳转的各个路由

6.实现添加购物车类似的复杂路由判断

- 如果是同一类商品的添加，则在cartItems里只增加quantity INT的数量
- 如果是不同类商品的添加，则增加acrtId INT的数量

### 前端

见frontend

出现的bug

1. npm install后，运行 npm run serve 报错

   > Node Sass could not find a binding for your current environment: Windows 64-bit with Node.js 8.x

   原因是我现在电脑node版本比这个前端包里面的node版本高，sass版本混乱了

   ​     解决：npm rebuild node-sass

2. npm rebuild 报错

   提示我：

> Try to update node-gyp and file an Issue if it does not help 

​            解决： npm install node-gyp -g

   再次运行，成功