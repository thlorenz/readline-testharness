'use strict';

var createRli = require('./readline')
  , parseKey = require('parse-key')
  ;

module.exports = function createHarness (readlineWrapper) { 
  var hns = {
      rli        : undefined 
    , rlv        : undefined 
    , normal     : undefined
    , insert     : undefined
    , key        : key
    , code       : code
    , seq        : seq
    , keyed      : undefined
    , coded      : undefined
    , seqed      : undefined
    , written    : []
    , writtenStr : []

    , resetModes : resetModes
    , reset      : reset
    // assign to function to perform extra reset steps with every reset
    , onreset    : undefined
  };

  function key(k) {
    var keyObj;
    keyObj = parseKey(k);
    hns.rli._ttyWrite(null, keyObj);
    hns.keyed = ' [' + k + '] ';
  }

  function code(code_) {
    hns.rli._ttyWrite(code_, { });
    hns.coded = ' [' + code_ + '] ';
  }

  function seq(seq_) {
    var keys = seq_.split(' ');

    // since we are dealing with a sequence here, it makes sense to reset
    hns.reset();

    hns.key(keys.shift());
    hns.key(keys.shift());
    hns.seqed = ' [' + seq_ + '] ';
  }

  function resetModes() {
    hns.normal = 0;
    hns.insert = 0;
  }

  function reset() {
    hns.rli = createRli();
    hns.rlw = readlineWrapper(hns.rli);

    hns.resetModes();

    hns.keyed = hns.coded = hns.seqed = hns.pressed = undefined;
    hns.written = [] ;
    hns.writtenStr = [];
    
    hns.onreset();
    return hns;
  }
  reset();

  return hns;
};
