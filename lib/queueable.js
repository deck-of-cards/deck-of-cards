
export default function (target) {
  var queueing = []

  target.queue = queue
  return target

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
