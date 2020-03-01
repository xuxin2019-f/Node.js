(async ()=>{
  const Sequelize = require('sequelize')

  // 建立连接
  const sequelize = new Sequelize('kaikeba','root','DAxuxin0727/',{
    host:'localhost',
    dialect:'mysql'
  })

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

  // 同步数据库 force为true代表强制同步
  let ret = await Fruit.sync({force:false})

  //插入
  // ret = await  Fruit.create({
  //   name:'苹果',
  //   price:3.5
  // })
  // console.log('create:',ret)
  // await  Fruit.create({
  //   name:'橘子',
  //   price:1
  // }).then(()=>{
  //   console.log('ok')
  // })

  // 更新操作
  ret = await Fruit.update({price:4},{
    where:{
      name:'香蕉'
    }
  })

  // 查询全部
  // ret = await Fruit.findAll()
  // // 让查询结果更美观
  // console.log('find:',JSON.stringify(ret,'','\t'))

   // 条件查询
   // 查询操作符
  // const Op = Sequelize.Op
  // ret = await  Fruit.findAll({
  //     // 长度在2-4之间
  //     where:{price:{[Op.lt]:4,[Op.gt]:2}}
  //   })


  // 按照属性查询
  //  await Fruit.findOne({
  //   where:{name:'苹果'}
  // }).then(fruit =>{
  //   console.log(fruit.get())
  //  })

     Fruit.findOne({attributes:['name']}).then(fruit =>{
       console.log(fruit.get())
     })

  //删除
    res = await Fruit.destroy({where:{name:'苹果'}})
    console.log(res)
})()
