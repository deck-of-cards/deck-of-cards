
export default function (target) {
  var array = Array.prototype

  var queueing = []

  target.queue = queue
  target.queued = queued

  return target

  function queued (action) {
    return function () {
      var self = this
      var args = arguments

      queue(function (next) {
        action.apply(self, array.concat.apply(next, args))
      })
    }
  }

  function queue (action) {
    if (!action) {
      return
    }

    queueing.push(action)

    if (queueing.length === 1) {
      next()
    }
  }
  function next () {
    queueing[0](function (err) {
      if (err) {
        throw err
      }

      queueing = queueing.slice(1)

      if (queueing.length) {
        next()
      }
    })
  }
}
