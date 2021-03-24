/* eslint-disable no-undef */
const assert = require('assert');
const getNoNull = require('./get-no-null');

describe('getNoNull', function () {
  const data = {
    arr: [{ value: { a: 'b' } }, 'text'],
    2: 'd'
  };

  const arr = [{ nested: { value: [{ rather: 'deep' }] } }, 1];
  it('Should retrieve a value from an object with a valid key', function () {
    assert.strictEqual(getNoNull(data, 'arr.0.value.a'), 'b');
    assert.strictEqual(getNoNull(data, 'arr.0.value').a, 'b');
    assert.strictEqual(getNoNull(data, '2'), 'd');
  });

  it('Should return the default value when an invalid key is provided for an object', function () {
    assert.strictEqual(getNoNull(data, 'arr.0.values.a', 'default'), 'default');
    assert.strictEqual(getNoNull(data, 'arr.3.value', { z: 'b' }).z, 'b');
    assert.strictEqual(getNoNull(data, '3'), '');
  });

  it('Should retrieve a value from an array with a valid key', function () {
    assert.strictEqual(getNoNull(arr, '0.nested.value.0.rather'), 'deep');
    assert.strictEqual(getNoNull(arr, '0.nested.value.0').rather, 'deep');
    assert.strictEqual(getNoNull(arr, '1'), 1);
  });
  it('Should return the default value from an array with a partially valid key', function () {
    assert.strictEqual(getNoNull(arr, '1.nested.value.0.rather', 'default'), 'default');
  });
  it('Should return the default value from an array with an invalid key', function () {
    assert.strictEqual(getNoNull(arr, '0.nested.value.1', { rather: 'deep' }).rather, 'deep');
    assert.strictEqual(getNoNull(arr, '2'), '');
  });
});

