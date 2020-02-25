const fs = require('fs');
//通过创建一个可读流
const rs = fs.createReadStream('./1.txt',{
  flags:'r',//我们要对文件进行何种操作
  mode:0o666,//权限位
  encoding:'utf8',//不传默认为buffer，显示为字符串
  start:3,//从索引为3的位置开始读
  //这是我的见过唯一一个包括结束索引的
  end:8,//读到索引为8结束
  highWaterMark:2//缓冲区大小
});
rs.on('open',function () {
  console.log('文件打开');
});
rs.setEncoding('utf8');//显示为字符串
//希望流有一个暂停和恢复触发的机制
rs.on('data',function (data) {
  console.log(data);
  rs.pause();//暂停读取和发射data事件
  setTimeout(function(){
    rs.resume();//恢复读取并触发data事件
  },2000);
});
//如果读取文件出错了，会触发error事件
rs.on('error',function () {
  console.log("error");
});
//如果文件的内容读完了，会触发end事件
rs.on('end',function () {
  console.log('读完了');
});
rs.on('close',function () {
  console.log('文件关闭');
});

const ws = fs.createWriteStream('./2.txt',{
  flags:'w',
  mode:0o666,
  highWaterMark:3//默认是16K
});
let flag = ws.write('1');
console.log(flag);//true
flag =ws.write('2');
console.log(flag);//true
flag =ws.write('3');
console.log(flag);//false
flag =ws.write('4');
console.log(flag);//false
