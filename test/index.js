var nickslist = require('..')
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var test = require('tape')
function makeLog () {
  return hyperlog(memdb(), {
    valueEncoding: 'json'
  })
}
var log = makeLog()

var m = null
test('can make keys, make manager', t => {
  var keys = nickslist.makeKeys()
  t.ok('signKeypair')
  t.ok('encryptKeypair')
  m = nickslist.manager(keys, log)
  t.ok(m.post)
  t.ok(m.reply)
  t.end()
})

function check (t) {
  return (p) => {
    t.ok(p, 'exists')
    t.ok(p.key, 'has key prop')
    t.ok(p.value.body, 'has value.body prop')
    t.deepEqual(typeof p.value.encryptPublicKey,
                'object',
                'value.encryptPublicKey is an object')
  }
}

var p = null
test('can make a post, hear it over \'post\' emitter', t => {
  t.plan(9)
  //s ame schema on something over the emitter
  m.on('post', check(t))
  // and something we post ourselves
  m.post({ body: 'hello'}, (err, node) => {
    t.notOk(err)
    check(t)(node)
    p = node
  })
})

test('can reply to that post', t => {
  t.plan(6)
  m.removeAllListeners()
  //s ame schema on something over the emitter
  m.on('post', check(t))
  m.reply(p, { body: 'sup'}, (err, node) => {
    t.notOk(err)
    t.ok(node)
  })
})
