node-lei-call
=============

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
call.hook('say_hello:before', function (params, next, end) {
  console.log('before');
  next();
});
call.hook('say_hello:after', function (params, next, end) {
  console.log('after');
});

// 调用函数
call('say_hello', {value: 123}, function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

详细使用方法请参考测试文件。
