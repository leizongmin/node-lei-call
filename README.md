node-lei-call
=============

[![Greenkeeper badge](https://badges.greenkeeper.io/leizongmin/node-lei-call.svg)](https://greenkeeper.io/)

支持Hook的函数集合管理

```JavaScript
var leiCall = require('lei-call');

var call = leiCall();

// 注册函数
call.register('say_hello', function (params, callback) {
  params.value++;
  callback(null, params);
});

// 注册hook，格式：函数名称:before|after
// 具体用法可参考lei-pipe模块
call.before('say_hello', {
  name: 'hook name',  // hook名称，可选
  before: ['xxx'],    // 指定在哪些hook之前运行，可选
  after: ['xxx']      // 指定在哪些hook之后运行，可选
}, function (params, next, end) {
  console.log('before');
  next();
});
call.after('say_hello', function (params, next, end) {
  console.log('after');
});

// 调用函数
call('say_hello', {value: 123}, function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

详细使用方法请参考测试文件。
