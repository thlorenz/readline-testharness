'use strict';

var createRli = require('./readline')
  , parseKey = require('parse-key')
  ;

module.exports = function createHarness (wraprli) { 
  var hns = {
      rli        : undefined 
      // wrapper returned by calling the wraprli
    , rlw        : undefined
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
    hns.rlw = wraprli(hns.rli);

    hns.resetModes();

    hns.keyed = hns.coded = hns.seqed = hns.pressed = undefined;
    hns.written = [] ;
    hns.writtenStr = [];
    
    // do more reset steps if the function is set
    if (hns.onreset) hns.onreset();
    return hns;
  }
  reset();

  return hns;
};
