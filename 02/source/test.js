// var test1 = {x:1};
//
// var test2 = new Object(test1);
//
// var test3 = Object.create(test1);
// console.log(test3);//{}
// //test3等价于test5
// var test4 = function(){
//
// }
// test4.prototype = test1;
// var test5 = new test4();
// console.log(test5);
// console.log(test5.__proto__ === test3.__proto__);//true
// console.log(test2);//{x:1}

var test = Object.create({x:123,y:345});
console.log(test);//{}
console.log(test.x);//123
console.log(test.__proto__.x);//123
console.log(test.__proto__.x === test.x);//true
var test1 = new Object({x:123})
console.log(test1)
console.log(test1._protp_)
