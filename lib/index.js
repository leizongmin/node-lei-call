/**
 * Lei Call
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var Pipe = require('lei-pipe');
var debug = require('debug')('lei:call');

module.exports = createCallManager;

function createCallManager () {

  function call (name, params, callback) {
    if (arguments.length === 2) {
      callback = params;
      params = {};
    }
    var info = call._functions[name];
    if (!info) return callback(new Error('Function "' + name + '" does not exists'));
    debug('call %s', name);
    var data = params;
    simpleAsyncSeries(
      function (next) {
        if (!info.before) return next();
        debug(' - before: %s', name);
        info.before.start(data, function (err, ret) {
          data = ret;
          next(err);
        });
      },
      function (next) {
        debug(' - call: %s', name);
        info.fn(data, function (err, ret) {
          data = ret;
          next(err);
        })
      },
      function (next) {
        if (!info.after) return next();
        debug(' - after: %s', name);
        info.after.start(data, function (err, ret) {
          data = ret;
          next(err);
        });
      },
      function (err) {
        debug(' - callback: %s', err);
        callback(err, data);
      }
    );
  }

  call._functions = {};

  call.register = function (name, fn) {
    if (!call._functions[name]) call._functions[name] = {};
    call._functions[name].fn = fn;
    debug('register: %s => %s', name, fn);
    return call;
  };

  function addHook (name, order, options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    if (!call._functions[name]) call._functions[name] = {};
    if (!call._functions[name][order]) call._functions[name][order] = new Pipe();
    if (!options.name) options.name = randomString(10);
    debug('add hook: %s %s [%s]', order, name, options.name);
    call._functions[name][order].add(options.name, options, fn);
  }

  call.before = function (name, options, fn) {
    addHook(name, 'before', options, fn);
    return call;
  };

  call.after = function (name, options, fn) {
    addHook(name, 'after', options, fn);
    return call;
  };

  return  call;
}


function randomString (size) {
  size = size || 6;
  var code_string = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var max_num = code_string.length + 1;
  var new_pass = '';
  while (size > 0) {
    new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
    size--;
  }
  return new_pass;
}

function simpleAsyncSeries () {
  var args = Array.prototype.slice.call(arguments, 0);
  var callback = args.pop();
  function next (err) {
    if (err) return callback(err);
    if (args.length < 1) return callback();
    var fn = args.shift();
    if (typeof fn !== 'function') return next();
    fn(next);
  }
  next();
}
