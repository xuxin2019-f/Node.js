# TypeScript与装饰器

## ts

[ts装饰器官方文档](https://www.tslang.cn/docs/handbook/decorators.html)

[装饰器文档1](https://www.jianshu.com/p/f4c961cbb074)

- 类（es6有）

- 接口interfaces

- 模块modules

- **类型注解（最有用）**：

  ​                   （1）装饰器 (ES6中配置也可以用)

​                           （2）注解

- 编译时类型检查
- 箭头函数Arrow ——Lambda表达式（es6有（

### 装饰器

*装饰器*是一种特殊类型的声明，它能够被附加到[类声明](https://www.tslang.cn/docs/handbook/decorators.html#class-decorators)，[方法](https://www.tslang.cn/docs/handbook/decorators.html#method-decorators)， [访问符](https://www.tslang.cn/docs/handbook/decorators.html#accessor-decorators)，[属性](https://www.tslang.cn/docs/handbook/decorators.html#property-decorators)或[参数](https://www.tslang.cn/docs/handbook/decorators.html#parameter-decorators)上。 装饰器使用`@expression`这种形式，`expression`求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

例如，有一个`@sealed`装饰器，我们会这样定义`sealed`函数：

```ts
function sealed(target) {
    // do something with "target" ...
}
```

```ts
// 如果不传参params指的就是传进来的类，如果传参，指的就是传的参数
function logClz(params:any){
    console.log(params)
    //  target: class HttpClient
    return (target:any)=> {
       console.log('target:',target)
    }
}
@logClz(1)
class HttpClient {
    constructor(){}
}
```



#### 装饰器优先级

**不同装饰器的执行顺序：属性装饰器 > 方法装饰器 > 参数装饰器 > 类装饰器**

#### 装饰器组合（顺序）

多个装饰器可以同时应用到一个声明上，就像下面的示例：

- 书写在同一行上：

```ts
@f @g x
```

- 书写在多行上：

```ts
@f
@g
x
```

当多个装饰器应用于一个声明上，它们求值方式与[复合函数](http://en.wikipedia.org/wiki/Function_composition)相似。在这个模型下，**当复合*f*和*g*时，复合的结果(*f* ∘ *g*)(*x*)等同于*f*(*g*(*x*))。**

**同样的，在TypeScript里，当多个装饰器应用在一个声明上时会进行如下步骤的操作：**

1. **由上至下依次对装饰器表达式求值。**
2. **求值的结果会被当作函数，由下至上依次调用。**

举例1：

执行顺序：首先执行**方法装饰器**，**为复合形式**：先执行@anotationMethods(3)中的console.log(1)**表达式**，再嵌套@anotationMethods(2)，执行其中的console.log(2**)表达式，然后对于返回的值从内向外执行**

​                   再执行**类装饰器**，也是**复合形式，由外到内依次对装饰器内表达式求值，对于返回结果从内向外依次调用**

​    所以最后的结果：

> anotationMethods evaluated 3
> anotationMethods evaluated 2
> target 2--[object Object]
> target 3--[object Object]
> anotationClass evaluated 1
> anotationClass evaluated 2
> anotationClass executed 2
> anotationClass executed 1
> logAttr
> logMethod
> logParam22
> logParam11
> logClz22

```ts
类装饰器
function anotationClass(id){
    console.log('anotationClass evaluated', id);
    return (target) => console.log('anotationClass executed', id);
}
// 方法装饰器
function anotationMethods(id){
    console.log('anotationMethods evaluated', id);
    return (target, property, descriptor) => console.log('target', `${id}--${target}`);
}

@anotationClass(1)
@anotationClass(2)
class Example {
    @anotationMethods(3)
    @anotationMethods(2)
    method(){}
}
```

举例2

先执行属性装饰器logAttr，再执行方法装饰器logMethod，然后执行方法参数装饰器，**从左到右也是嵌套的复合关系，但由于logParam11和logParam22中没有表达式，直接是return返回，所以先打印logParam22,再打印lopParam11, 然后执行类装饰器，由上到下为嵌套的复合关系**

```ts
function logClz11(params:string) {
    return function(target:any) {
        console.log('logClz11')
    }
}
function logClz22(params?:string) {
    return function(target:any) {
        console.log('logClz22')
    }
}
function logAttr(params?:string) {
    return function(target:any, attrName:any) {
        console.log('logAttr')
    }
}
function logMethod(params?:string) {
    return function(target:any, methodName:any, desc:any) {
        console.log('logMethod')
    }
}
function logParam11(params?:any) {
    return function(target:any, methodName:any, paramIndex:any) {
        console.log('logParam11')
    }
}
function logParam22(params?:any) {
    return function(target:any, methodName:any, paramIndex:any) {
        console.log('logParam22')
    }
}

@logClz11('http://baidu.com')
@logClz22()
class HttpClient {
    @logAttr()
    public url:string|undefined;

    constructor() { }

    @logMethod()
    getData() {
        console.log('get data');
    }

    setData(@logParam11() param1:any, @logParam22() param2:any) {
        console.log('set data');
    }
}
// logAttr --> logMethod --> logParam22 --> logParam11 --> logClz22 --> logClz11
```

### 日志应用和切面实现

```ts
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
//日志应用和切面实现.....
//Calling "add" with [Arguments] { '0': 2, '1': 4 }
```



# 构建ts框架

见pdf

路由定义及发现

想要实现 @get(url)或@post(url)，就自动把url添加到路由规则里