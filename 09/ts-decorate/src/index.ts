// 类装饰器
function anotationClass(id){
    console.log('anotationClass evaluated', id);
    return (target) => console.log('anotationClass executed', id);
}
// // 方法装饰器
// function anotationMethods(id){
//     console.log('anotationMethods evaluated', id);
//     return (target, property, descriptor) => console.log('target', `${id}--${target}`);
// }

// @anotationClass(1)
// @anotationClass(2)
// class Example {
//     @anotationMethods(3)
//     @anotationMethods(2)
//     method(){}
// }

// 自己测试
function test(target,name,descriptor){
    return (target,name,descriptor) => console.log(`target:${target} name:${name} des:${descriptor}`)
}
@anotationClass(2)
class testname{
    @test()
    method(){}
}

// function logClz11(params:string) {
//     return function(target:any) {
//         console.log('logClz11')
//     }
// }
// function logClz22(params?:string) {
//     return function(target:any) {
//         console.log('logClz22')
//     }
// }
// function logAttr(params?:string) {
//     return function(target:any, attrName:any) {
//         console.log('logAttr')
//     }
// }
// function logMethod(params?:string) {
//     return function(target:any, methodName:any, desc:any) {
//         console.log('logMethod')
//     }
// }
// function logParam11(params?:any) {
//     return function(target:any, methodName:any, paramIndex:any) {
//         console.log('logParam11')
//     }
// }
// function logParam22(params?:any) {
//     return function(target:any, methodName:any, paramIndex:any) {
//         console.log('logParam22')
//     }
// }

// @logClz11('http://baidu.com')
// @logClz22()
// class HttpClient {
//     @logAttr()
//     public url:string|undefined;

//     constructor() { }

//     @logMethod()
//     getData() {
//         console.log('get data');
//     }

//     setData(@logParam11() param1:any, @logParam22() param2:any) {
//         console.log('set data');
//     }
// }
// logAttr --> logMethod --> logParam22 --> logParam11 --> logClz22 --> logClz11

// 如果不传参params指的就是传进来的类，如果传参，指的就是传的参数
// function logClz(params:any){
//     console.log(params)
//     //  target: class HttpClient
//     return (target:any)=> {
//        console.log('target:',target)
//     }
// }
// @logClz(1)
// class HttpClient {
//     constructor(){}
// }

function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

@classDecorator
class Greeter {
    property = "property";
    hello: string;
    constructor(m: string) {
        this.hello = m;
    }
}

console.log(new Greeter("world"));

// 日志应用和切面实现
console.log('日志应用和切面实现.....')
function log(target, name, descriptor) {
    var oldValue = descriptor.value;

    descriptor.value = function () {
        console.log(`Calling "${name}" with`, arguments);
        return oldValue.apply(null, arguments);
    }
    return descriptor;
}
class Maths {
    @log
    add(a, b) {
        return a + b;
    }
}
const math = new Maths()
math.add(2, 4)

