const { exec } = require('child_process')
exec('node test', (err, stdout, stderr) => {
  if (err) {
    console.log(err)
  } else {
    console.log(stdout.toString())
  }
})
