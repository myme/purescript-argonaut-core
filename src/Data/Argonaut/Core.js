"use strict";

function id(x) {
  return x;
}

exports.fromBoolean = id;
exports.fromNumber = id;
exports.fromString = id;
exports.fromArray = id;
exports.fromObject = id;

exports.jsonNull = null;

exports.stringify = function (j) {
  return JSON.stringify(j);
};

var objToString = Object.prototype.toString;
var objKeys = Object.keys;

function isArray(a) {
  return objToString.call(a) === "[object Array]";
}

exports._caseJson = function (isNull, isBool, isNum, isStr, isArr, isObj, j) {
  if (j == null) return isNull();
  else if (typeof j === "boolean") return isBool(j);
  else if (typeof j === "number") return isNum(j);
  else if (typeof j === "string") return isStr(j);
  else if (objToString.call(j) === "[object Array]")
    return isArr(j);
  else return isObj(j);
};

exports._compare = function _compare (EQ, GT, LT, a, b) {
  if (a == null) {
    if (b == null) return EQ;
    else return LT;
  } else if (typeof a === "boolean") {
    if (typeof b === "boolean") {
      // boolean / boolean
      if (a === b) return EQ;
      else if (a === false) return LT;
      else return GT;
    } else if (b == null) return GT;
    else return LT;
  } else if (typeof a === "number") {
    if (typeof b === "number") {
      if (a === b) return EQ;
      else if (a < b) return LT;
      else return GT;
    } else if (b == null) return GT;
    else if (typeof b === "boolean") return GT;
    else return LT;
  } else if (typeof a === "string") {
    if (typeof b === "string") {
      if (a === b) return EQ;
      else if (a < b) return LT;
      else return GT;
    } else if (b == null) return GT;
    else if (typeof b === "boolean") return GT;
    else if (typeof b === "number") return GT;
    else return LT;
  } else if (isArray(a)) {
    if (isArray(b)) {
      for (var i = 0; i < Math.min(a.length, b.length); i++) {
        var ca = _compare(EQ, GT, LT, a[i], b[i]);
        if (ca !== EQ) return ca;
      }
      if (a.length === b.length) return EQ;
      else if (a.length < b.length) return LT;
      else return GT;
    } else if (b == null) return GT;
    else if (typeof b === "boolean") return GT;
    else if (typeof b === "number") return GT;
    else if (typeof b === "string") return GT;
    else return LT;
  } else {
    if (b == null) return GT;
    else if (typeof b === "boolean") return GT;
    else if (typeof b === "number") return GT;
    else if (typeof b === "string") return GT;
    else if (isArray(b)) return GT;
    else {
      var akeys = objKeys(a);
      var bkeys = objKeys(b);
      if (akeys.length < bkeys.length) return LT;
      else if (akeys.length > bkeys.length) return GT;
      var keys = akeys.concat(bkeys).sort();
      for (var j = 0; j < keys.length; j++) {
        var k = keys[j];
        if (!a.hasOwnProperty(k)) return LT;
        else if (!b.hasOwnProperty(k)) return GT;
        var ck = _compare(EQ, GT, LT, a[k], b[k]);
        if (ck !== EQ) return ck;
      }
      return EQ;
    }
  }
};
