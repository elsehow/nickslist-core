var hyperreal = require ('hyperreal')
var EE = require('events').EventEmitter
var talk = require('real-talk')
var keys = require('hyperreal/keys')

function makeKeys () {
  return {
    signKeypair: keys.signKeypair(),
    encryptKeypair: keys.encryptKeypair(),
  }
}

function emitWith (em, ev) {
  return (msg, ePk, node) => {
    em.emit(ev, node)
  }
}

function manager (keys, log) {

  function wrap (hyperlogCb) {
    if (hyperlogCb)
      return (err, node) => {
        // emit all errors
        if (err) {
          emitter.emit('error', err)
        }
        // fix encrypt keypair to all called-back nodes
        if (node) {
          node.value.encryptPublicKey =
            keys.encryptKeypair.publicKey
        }
        hyperlogCb(err, node)
        return
      }
    return
  }


  var emitter = new EE()

  function emitPost (p) {
    emitter.emit('post', p)
    return
  }

  var real = hyperreal(
    log,
    keys.signKeypair,
    keys.encryptKeypair)

  real.on('signed', emitPost)
  real.on('encrypted', emitPost)

  emitter.post =(msg, cb) => {
    real.signedMessage(null, msg, wrap(cb))
  }

  emitter.reply = (node, msg, cb) => {
    real.encryptedMessage([node.key],
                          msg,
                          node.value.encryptPublicKey,
                          wrap(cb))
  }

  return emitter
}

module.exports = {
  makeKeys: makeKeys,
  manager: manager,
}
