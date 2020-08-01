const { spawn } = require('child_process')
const nodeChildProcess = spawn('node', ['app1.js'])
nodeChildProcess.stdout.on('data', (data) => {
  console.log(data.toString())
  console.log(`child2 process id: ${nodeChildProcess.pid}`)
})
