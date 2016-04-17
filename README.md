# nickslist-core

core state management for [nickslist](https://github.com/elsehow/nickslist)

## install

```
npm install nickslist-core
```

## use

```javascript
var nickslist = require('nickslist-core')
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})
var manager = nickslist.manager(nickslist.makeKeys(), log)
manager.on('post', p => {
  console.log('i see a post!', p.value.body)
})
manager.post({ hello: 'hi' }, (err, node) => {
  manager.reply(node, { whats: 'up'})
})
```

## api

### var keys = nickslist.makeKeys()

returns an object `{ signKeypair, encryptKeypair }` (see [hyperreal](https://github.com/elsehow/hyperreal))

pass `keys` into `nickslist.manager(keys, hyperlog)`

### var list = nickslist.manager(keys, hyperlog)

`keys` are from `nickslist.makeKeys()`

`hyperlog` is any [hyperlog](https://github.com/mafintosh/hyperlog)-like object

### list.post(msg, cb)

`msg` is an object, which we will post *verified* (but *not* encrypted)

`cb(err, node)` will pass back the node that was added to the hyperlog (converted to in cleartext)

### list.reply(node, msg, cb)

`node` is some node, to which we will *encrypt* our reply

`msg` is an object

`cb(err, node)` will pass back the node that was added to the hyperlog (converted to in cleartext). `node.links` will refer to the node we're replying to

### list.on('post', cb)

`cb(post)` called whenever a post comes in over the hyperlog (including our own)

### list.on('error', cb)

`cb(err)` called whenever there's an error putting something on the hyperlog. (same `err` will be passed through `list.reply()`' and `list.post()`'s cb.

## license

BSD
