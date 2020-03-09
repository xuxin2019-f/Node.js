const Controller = require('egg').Controller;
class userController extends Controller {
  async index() {
    // this.ctx.body = {
    //   name:'tom'
    // }
    const {ctx} = this
    ctx.body = await ctx.service.user.getAll()
  }
}
module.exports = userController
