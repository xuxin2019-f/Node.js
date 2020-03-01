(async ()=>{
  const {MongoClient:MongoDB} = require('mongodb')

  // 创建客户端
  const client = new MongoDB(
    'mongodb://localhost:27017',
    // 为了解决新老版本的问题
    {
      useNewUrlParser:true
    }
  )

  let ret
  // 创建链接
  ret = await client.connect()
  //console.log('ret:',ret)

  const db = client.db('test')
  // 建立新的集合
  const fruits = db.collection('fruits')

  // 添加文档
  ret = await fruits.insertOne({
    name:'芒果',
    price:20.1
  })
  //console.log('插入成功',JSON.stringify(ret))

  // 查询数据
  ret = await fruits.findOne()
  //console.log('查询文档',JSON.stringify(ret))

  // 更新文档，第一个是搜索条件
  // ret = await fruits.updateOne({name:'芒果'},{
  //   $set:{
  //     name:'苹果'
  //   }
  // })

  //删除
  ret = await fruits.deleteOne({name:'苹果'})
  console.log('删除成功',JSON.stringify(ret))

  // 全部删除
  await fruits.deleteMany()
  client.close()
})()
