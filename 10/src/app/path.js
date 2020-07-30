const path = require('path')

const outputPath = path.join(__dirname, 'myPath', 'hello.js')
console.log(outputPath)

const extInfo = path.extname(outputPath)
console.log(extInfo)

console.log(path.parse(outputPath))
