//node版本号
console.log(process.version)
//node及node的一些依赖的版本号
console.log(process.versions)
//平台
console.log(process.platform)
//node的绝对路径
console.log(process.execPath)
//node配置信息
console.log(process.config)
//当前正在执行的node进程的数值 重要，一些监听进程的第三方工具需要监听这个pid来获取信息、重启进程
console.log(process.pid)
//系统架构
console.log(process.arch)
//内存使用情况，被大量第三方工具使用
console.log(process.memoryUsage())
//当前运行的目录
console.log(process.cwd())
//改变当前工作目录 这个不返回结果
// process.chdir('../')
// console.log(process.cwd())

//环境属性 在很多第三方工具中都会被使用
//比如给process.env添加一个变量，赋予其生产或开发的字符串供第三方识别来进行不同的操作:
//process.env.NODE_ENV = 'dev' / process.env.NODE_ENV = 'pro'
console.log(process.env)

//事件 因为process继承于EventEmitter
//退出
process.on('beforeExit', (code) => {
  console.log(`node process beforeExit: ${code}`)
})
process.on('exit', (code) => {
  console.log(`node process exit: ${code}`)
})

// process.exit(0)

//异常捕获 在node中如果某个错误一直没被捕获，就会冒泡到主线程导致主线程的瘫痪
process.on('uncaughtException', (err) => {
  if (err) {
    console.log(err)
    console.log('====')
    console.log('uncaughtException occured')
  }
})
//故意引发错误
// a
