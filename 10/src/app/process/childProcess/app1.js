const { spawn } = require('child_process')
const lsChildProcess = spawn('node', ['../app.js'])
lsChildProcess.stdout.on('data', (data) => {
  console.log(data.toString())
  console.log(`child process id: ${lsChildProcess.pid}`)
})
lsChildProcess.on('error', (err) => {
  console.log('err', err)
})
lsChildProcess.on('exit', (code, signal) => {
  console.log(code)
})
