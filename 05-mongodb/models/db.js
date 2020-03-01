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
