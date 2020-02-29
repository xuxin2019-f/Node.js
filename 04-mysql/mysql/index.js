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

  // 创建table表 如果不存在test这个名字的表，则创建一个，设置id、message
  const CREATE_SQL = `CREATE TABLE IF NOT EXISTS test (
                         id INT NOT NULL AUTO_INCREMENT,
                         message VARCHAR(45) NULL,
                         PRIMARY KEY (id))`
  // execute表示执行
  let ret = await connection.execute(CREATE_SQL)
  console.log('create:',ret)

  // 向test表中插入参数
  // const INSERT_SQL = `INSERT INTO test(message) VALUES(?)`
  // ret = await connection.execute(INSERT_SQL,['abc'])
  // console.log('insert:',ret)

  // 查询
  const SELECT_SQL = `SELECT * FROM test`
  ret = await connection.execute(SELECT_SQL)
  // 解构赋值，rows是数据，fields是mantadata
  const [rows,fields] = ret
  console.log('rows',JSON.stringify(rows))
})()



