
const router = require('koa-router')()
const {
  init, get, create, update, del,
} = require('./api')
// 利用两个中间件操作，init实现根据list名字加载对象
router.get('/api/:list', init, get)
router.post('/api/:list', init,create)
router.put('/api/:list/:id', init, update)
router.delete('/api/:list/:id', init, del)

module.exports = router.routes()
