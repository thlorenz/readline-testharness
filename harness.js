'use strict';

var parseKey = require('parse-key');

module.exports = function createHarness (wraprli, createrli_) { 
  var createrli = createrli_ || require('./readline');
  var hns = {
      rli        : undefined 

      // wrapper returned by calling the wraprli
    , rlw        : undefined

    , key        : key
    , code       : code
    , seq        : seq
    , keyed      : undefined
    , coded      : undefined
    , seqed      : undefined

    , reset      : reset

    // assign to function to perform extra reset steps with every reset
    , onreset    : undefined
  };

  function key(k) {
    var keyObj;
    try { 
      keyObj = parseKey(k);
    } catch(e) {
      // XXX: probably should fix parse key to handle these cases (same for stringify key)
      keyObj = { name: k };
    }
    hns.rli._ttyWrite(null, keyObj);
    hns.keyed = ' [' + k + '] ';
  }

  function code(code_) {
    hns.rli._ttyWrite(code_, { });
    hns.coded = ' [' + code_ + '] ';
  }

  function seq(seq_) {
    var keys = seq_.split(' ');

    hns.key(keys.shift());
    hns.key(keys.shift());
    hns.seqed = ' [' + seq_ + '] ';
  }

  function reset() {
    hns.rli = createrli();
    hns.rlw = wraprli(hns.rli);

    hns.keyed = hns.coded = hns.seqed = undefined;
    
    // do more reset steps if the function is set
    if (hns.onreset) hns.onreset();
    return hns;
  }
  reset();

  return hns;
};
