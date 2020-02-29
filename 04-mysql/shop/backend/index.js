const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()

app.use(require('koa-static')(__dirname + '/'))
app.use(bodyParser())

// 初始化数据库
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// 创建数据库依赖
Product.belongsTo(User, {
  constraints: true,
  // 如果用户购物车里只有一个商品，则不允许被删除
  onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {
  // 定义cart和product是一对多的关系，并描述了中间表CartItem
  through: CartItem
});
Product.belongsToMany(Cart, {
  through: CartItem
});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {
  through: OrderItem
});
Product.belongsToMany(Order, {
  through: OrderItem
});


sequelize.sync().then(
  async result =>{
    // 创建用户
    let user = await User.findByPk(1)
    if(!user) {
      user = await  User.create({
        name:'xuxin',
        email:'xia@adf.com'
      })
      // 由于上面已经描述了user和cart的关系，则会自动为user提供这个创建cart的方法
      await user.createCart()
    }
    app.listen(3000,()=>{
      console.log('Listen at 3000')
    })
  }
)

// 鉴权
app.use(async (ctx,next)=>{
  // 找到第一个用户
  const user = await User.findByPk(1)
  ctx.user = user
  await next()
})


// 查询商品
router.get('/admin/products',async ctx=>{
  const products = await Product.findAll()
  ctx.body = {prods: products}
})
app.use(router.routes())
// 创建产品
router.post('/admin/product', async ctx => {
  const body = ctx.request.body
  const res = await ctx.user.createProduct(body)
  ctx.body = {success:true}
})
router.delete('/admin/product/:id', async (ctx, next) => {
  const id = ctx.params.id
  const res = await Product.destroy({
    where: {
      id
    }
  })
  ctx.body = { success: true }
})

router.get('/cart', async ctx => {
  const cart = await ctx.user.getCart()
  const products = await cart.getProducts()
  ctx.body = { products }
})
/**
 * 添加购物车
 */
router.post('/cart', async ctx => {
  const body = ctx.request.body
  console.log('ctx.body', ctx.request.body)
  const prodId = body.id;
  let fetchedCart;
  let newQty = 1;


  // 获取购物车
  const cart = await ctx.user.getCart()
  console.log('cart', cart)
  fetchedCart = cart;
  const products = await cart.getProducts({
    where: {
      id: prodId
    }
  });

  let product;
  // 判断购物车数量
  if (products.length > 0) {
    product = products[0];
  }
  if (product) {
    // 已有商品
    const oldQty = product.cartItem.quantity;
    newQty = oldQty + 1;
    console.log("newQty", newQty);
  } else {
    // 没有
    product = await Product.findByPk(prodId);
  }

  await fetchedCart.addProduct(product, {
    through: {
      quantity: newQty
    }
  });
  ctx.body = { success: true }
})


// 添加订单
router.post('/orders', async ctx => {
  let fetchedCart;
  const cart = await ctx.user.getCart();
  fetchedCart = cart;
  const products = await cart.getProducts();
  const order = await ctx.user.createOrder();
  const result = await order.addProducts(
    products.map(p => {
      p.orderItem = {
        quantity: p.cartItem.quantity
      };
      return p;
    })
  );
  await fetchedCart.setProducts(null);
  ctx.body = { success: true }
})
router.delete('/cartItem/:id', async ctx => {
  const id = ctx.params.id
  const cart = await ctx.user.getCart()
  const products = await cart.getProducts({
    where: { id }
  })
  const product = products[0]
  await product.cartItem.destroy()
  ctx.body = { success: true }
})
router.get('/orders', async ctx => {
  const orders = await ctx.user.getOrders({ include: ['products'], order: [['id', 'DESC']] })
  ctx.body = { orders }
})

