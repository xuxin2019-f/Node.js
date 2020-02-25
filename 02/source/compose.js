// // const compose = (fn1,fn2) => (...args) =>fn2(fn1(...args))
// // 实现多函数嵌套
// const compose = (...[first,...other]) => (...args) =>{
//   let ret = first(...args)
//   other.forEach(fn=>{
//     ret = fn(ret)
//   })
//   return ret
// }
// const add = (x,y) => x+y
// const square = z => z*z
// const fn = compose(add,square)
// console.log(fn(1,2))

function compose(middlewares) {
  return function () {
    // 执行第一个
    return dispatch(0)
    function dispatch(i) {
      let fn = middlewares[i]
      if(!fn){
        // 如果不是函数，说明空了，则返回一个空异步promise
        return Promise.resolve()
      }
      return Promise.resolve(
        fn(function next() {
        //  执行下一个
          console.log('下一个')
          return dispatch(i+1)
        })
      )
    }
  }
}

async function fn1(next){
  console.log('fn1')
  await next()
  console.log('end fn1')
}

async function fn2(next){
  console.log('fn2')
  await delay()
  await next()
  console.log('end fn2')
}

function fn3(next){
  console.log('fn3')
}

function delay(){
  return Promise.resolve(res => {
    setTimeout(() => reslove(),2000)
  })
}

const middlewares = [fn1,fn2,fn3]
const finalFn = compose(middlewares)
finalFn()


