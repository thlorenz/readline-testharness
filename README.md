# readline-testharness

Harness for testing modules that add functionality to the nodejs readline.

```js
var wraprli= require('./module/totest') 
  , harness = require('readline-testharness')
  , createHarness = harness.create
  , createRli = harness.rli;
  , assert = require('assert');

var rli = createRli()
  , hns = createHarness(wraprli, rli);

hns.key('b');

assert.equal(hns.rli.wordLeft, 1, 'moves cursor one word left');
```

## Installation

    npm i -D readline-testharness

## API

### ***harness.create(wrapperFn[, createRli]);***

- creates a harness to test the given readline interface wrapper function 
- `createRli` (rli mock creator function) is optional and [default one](https://github.com/thlorenz/readline-testharness/blob/master/readline.js) is
  used if it is not given

#### harness functions/properties

- `hns.rli` the readline interface mock
- `hns.rlw` the return value of the given `wrapperFn`
- `hns.key(k)` simulates a key press. `k` is a readline key (i.e. `{ name: 's', ctrl: true }`)
- `hns.keyed` keeps track of calls to `hns.key` (mainly for test description)
- `hns.code(c)` simulates a key press with the given code (`c`)
- `hns.coded` keeps track of calls to `hns.code` (mainly for test description)
- `hns.seq(s)` simulates a sequence of key presses, one for each char in `s`
- `hns.seqed` keeps track of calls to `hns.seq` (mainly for test description)
- `hns.reset` resets the state of the harness (i.e. creates new `rli` and `rlw` and resets `keyed`, `coded` and
  `seqed`
- `hns.onreset` assign a function that you want to be called during `hns.reset`

### ***harness.rli()***

- creates a readline interface mock that keeps track of functions called and properties on it
- it exposes properties of same name as the readline interface functions, i.e., `moveCursor` tracks calls to `_moveCursor` 
- this can be used to create the default one and customize it before passing it to the harness
- for more info consult [its implementation](https://github.com/thlorenz/readline-testharness/blob/master/readline.js)
