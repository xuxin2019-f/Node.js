// 要求：根据cpu核心数来分配进程数
const cluster = require('cluster')
const http = require('http')
const os = require('os')

// 查询cpu核心数 是8 因此这里分配8个子进程
const cpuCount = os.cpus().length
//console.log(cpuCount)

// isMaster判断是否是父进程 isWorker判断是否是子进程
if (cluster.isMaster) {
  console.log('father')
  //如果是父进程，则创建子进程
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork()
  }
  //每次创建
  cluster.on('exit', (worker, code, signal) => {
    // worker指创建出来的进程
    console.log(worker.process.pid)
  })
} else {
  //子进程fork出来后会重新执行程序，因此这里要有判断
  // 由子进程创建http服务器
  const httpServer = http.createServer((req, res) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      })
      res.end(`${process.pid}`)
    })
  })
  //请求先到达的是主进程，因此这个3000是主进程监听的，再由主进程转发请求给某个子进程
  httpServer.listen(3000, () => {
    console.log(`child:${process.pid}`)
  })
}
