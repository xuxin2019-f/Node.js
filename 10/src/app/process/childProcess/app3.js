const { fork } = require('child_process')
//待执行的子进程地址 参数 可选参数
const forkProcess = fork('./test', { silent: true })
//主、子进程的通信
// 发送消息来的监听
forkProcess.on('message', (message) => {
  console.log(message)
})
// 发送消息
forkProcess.send('hello')
