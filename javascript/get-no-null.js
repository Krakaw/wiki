/**
 * Takes a dot notation string to extract a value from an object or array
 * Returns a default value if it is not found or only partially matched
 * @param obj Object or Array
 * @param keyString
 * @param defaultValue
 */

function getNoNull (obj, keyString, defaultValue = '') {
  const keyParts = keyString.split('.');
  const key = keyParts.shift();
  const isObject = Object.prototype.toString.call(obj) === '[object Object]';
  const isArray = Object.prototype.toString.call(obj) === '[object Array]';
  let result;
  let resultIsObj = true;
  if (isObject) {
    result = obj[key];
  } else if (isArray) {
    result = obj[parseInt(key)];
  } else {
    result = obj;
    resultIsObj = false;
  }
  if (keyParts.length && resultIsObj) {
    return getNoNull(result, keyParts.join('.'), defaultValue);
  } else {
    // If we have not finished retrieving the keys then we have an invalid path, return default
    return keyParts.length || !result ? defaultValue : result;
  }
}

module.exports = getNoNull;
