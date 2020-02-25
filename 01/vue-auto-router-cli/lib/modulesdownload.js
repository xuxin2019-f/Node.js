module.exports.clone = async function clone(repo,test) {
  const {promisify} = require('util')
  const download = promisify(require('download-git-repo'))
  const ora = require('ora')
  const process = ora(`正在下载${repo}`)
  process.start()
  try {
    await download(repo,test)
  } catch (error) {
    process.fail()
  }
  process.succeed()
}
