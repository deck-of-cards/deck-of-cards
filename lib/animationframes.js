
var ticking
var animations = []

export default function (delay, duration) {
  var now = Date.now()
  var start = now + delay
  var end = start + duration

  var animation = {
    start: start,
    end: end
  }

  animations.push(animation)

  if (!ticking) {
    ticking = true
    requestAnimationFrame(tick)
  }
  var self = {
    start: function (cb) {
      animation.startcb = cb
      return self
    },
    progress: function (cb) {
      animation.progresscb = cb
      return self
    },
    end: function (cb) {
      animation.endcb = cb
      return self
    }
  }
  return self
}

var previousTick = 0

function tick () {
  var now = Date.now()

  if (now - previousTick < 1000 / 60) {
    // maintain 60 fps
    requestAnimationFrame(tick)
    return
  }
  previousTick = now

  if (!animations.length) {
    ticking = false
    return
  }

  for (var i = 0, animation; i < animations.length; i++) {
    animation = animations[i]
    if (now < animation.start) {
      continue
    }
    if (!animation.started) {
      animation.started = true
      animation.startcb && animation.startcb()
    }
    var t = (now - animation.start) / (animation.end - animation.start)
    animation.progresscb && animation.progresscb(t < 1 ? t : 1)
    if (now > animation.end) {
      // Animation ended
      animation.endcb && animation.endcb()
      animations.splice(i--, 1)
      continue
    }
  }
  requestAnimationFrame(tick)
}

window.requestAnimationFrame || (window.requestAnimationFrame = function (cb) {
  setTimeout(cb, 0)
})
