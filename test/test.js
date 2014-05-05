/**
 * Lei Call Tests
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var should = require('should');
var createCall = require('../');

describe('lei-call', function () {

  it('#create', function () {
    var call = createCall();
    should.equal(typeof call, 'function');
    should.equal(typeof call.register, 'function');
    should.equal(typeof call.before, 'function');
    should.equal(typeof call.after, 'function');
  });

  it('#register', function (done) {
    var call = createCall();
    call.register('test_1', function (params, callback) {
      params.value++;
      callback(null, params);
    });
    call.register('test_2', function (params, callback) {
      params.value += params.step;
      callback(null, params);
    });
    call('test_1', {value: 5}, function (err, ret) {
      should.equal(err, null);
      ret.value.should.equal(6);
      call('test_1', {value: 10}, function (err, ret) {
        should.equal(err, null);
        ret.value.should.equal(11);
        call('test_2', {value: 10, step: 5}, function (err, ret) {
          should.equal(err, null);
          ret.value.should.equal(15);
          call('test_2', {value: 9, step: 9}, function (err, ret) {
            should.equal(err, null);
            ret.value.should.equal(18);
            done();
          });
        });
      });
    });
  });

  it('#before', function (done) {
    var call = createCall();
    call.register('test_1', function (params, callback) {
      callback(null, 'test_1');
    });
    call.register('test_2', function (params, callback) {
      params.text += 'test_2';
      callback(null, params);
    });
    call.before('test_2', function (params, callback) {
      params.is_hook_1 = true;
      callback();
    });
    call.before('test_2', function (params, callback) {
      params.is_hook_2 = true;
      callback(null, params);
    });
    call.before('test_2', {after: ['ooxx']}, function (params, callback) {
      params.is_hook_3 = true;
      params.text += 'A';
      callback();
    });
    call.before('test_2', {name: 'ooxx'}, function (params, callback) {
      params.is_hook_3 = true;
      params.text += 'B';
      callback();
    });
    call('test_1', {}, function (err, data) {
      should.equal(err, null);
      data.should.equal('test_1');
      call('test_2', {text: 'XX'}, function (err, data) {
        should.equal(err, null);
        should.equal(data.is_hook_1, true);
        should.equal(data.is_hook_2, true);
        should.equal(data.is_hook_3, true);
        should.equal(data.text, 'XXBAtest_2');
        done();
      });
    });
  });

it('#after', function (done) {
    var call = createCall();
    call.register('test_1', function (params, callback) {
      callback(null, 'test_1');
    });
    call.register('test_2', function (params, callback) {
      params.text += 'test_2';
      callback(null, params);
    });
    call.after('test_2', function (params, callback) {
      params.is_hook_1 = true;
      callback();
    });
    call.after('test_2', function (params, callback) {
      params.is_hook_2 = true;
      callback(null, params);
    });
    call.after('test_2', {after: ['ooxx']}, function (params, callback) {
      params.is_hook_3 = true;
      params.text += 'A';
      callback();
    });
    call.after('test_2', {name: 'ooxx'}, function (params, callback) {
      params.is_hook_3 = true;
      params.text += 'B';
      callback();
    });
    call('test_1', {}, function (err, data) {
      should.equal(err, null);
      data.should.equal('test_1');
      call('test_2', {text: 'XX'}, function (err, data) {
        should.equal(err, null);
        should.equal(data.is_hook_1, true);
        should.equal(data.is_hook_2, true);
        should.equal(data.is_hook_3, true);
        should.equal(data.text, 'XXtest_2BA');
        done();
      });
    });
  });

});
