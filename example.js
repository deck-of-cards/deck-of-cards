
var easing = Deck.easing
var prefix = Deck.prefix

var transform = prefix('transform')
var transition = prefix('transition')
var transitionDelay = prefix('transitionDelay')
var boxShadow = prefix('boxShadow')

var translate = Deck.translate

var $container = document.getElementById('container')
var $topbar = document.getElementById('topbar')

var $sort = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $fan = document.createElement('button')
var $poker = document.createElement('button')

$shuffle.textContent = 'Shuffle'
$sort.textContent = 'Sort'
$bysuit.textContent = 'By suit'
$fan.textContent = 'Fan'
$poker.textContent = 'Poker'

$topbar.appendChild($shuffle)
$topbar.appendChild($sort)
$topbar.appendChild($bysuit)
$topbar.appendChild($fan)
$topbar.appendChild($poker)

var deck = Deck()


// easter eggs start


var acesClicked = []
var kingsClicked = []

deck.cards.forEach(function (card, i) {
  card.enableMoving()

  card.$el.addEventListener('mousedown', onTouch)
  card.$el.addEventListener('touchstart', onTouch)

  function onTouch () {
    var card

    if (i % 13 === 0) {
      acesClicked[i] = true
      if (acesClicked.filter(function (ace) {
        return ace
      }).length === 4) {
        document.body.removeChild($topbar)
        deck.$el.style.display = 'none'
        setTimeout(function () {
          startWinning()
        }, 250)
      }
    } else if (i % 13 === 12) {
      if (!kingsClicked) {
        return
      }
      kingsClicked[i] = true
      if (kingsClicked.filter(function (king) {
        return king
      }).length === 4) {
        for (var j = 0; j < 3; j++) {
          card = Deck.Card(52 + j)
          card.mount(deck.$el)
          card.$el.style[transform] = 'scale(0)'
          card.enableMoving()
          deck.cards.push(card)
        }
        deck.sort(true)
        kingsClicked = false
      }
    } else {
      acesClicked = []
      if (kingsClicked) {
        kingsClicked = []
      }
    }
  }
})

function startWinning () {
  var $winningDeck = document.createElement('div')
  $winningDeck.classList.add('deck')

  $winningDeck.style[transform] = translate(Math.random() * window.innerWidth - window.innerWidth / 2 + 'px', Math.random() * window.innerHeight - window.innerHeight / 2 + 'px')

  $container.appendChild($winningDeck)

  for (var i = 0; i < 52; i++) {
    addWinningCard($winningDeck, i)
  }

  setTimeout(startWinning, 500)
}

function addWinningCard ($deck, i) {
  var card = Deck.Card(i)
  var delay = (52 - i) * 20

  var $xMovement = document.createElement('div')
  $xMovement.style.position = 'absolute'
  $xMovement.style[transform] = translate(0, 0)

  card.$el.style[boxShadow] = 'none'

  card.mount($xMovement)
  $deck.appendChild($xMovement)

  card.$el.style[transform] = translate(0, 0)

  setTimeout(function () {
    $xMovement.style[transition] = 'all 1s linear'
    $xMovement.style[transitionDelay] = delay / 1000 + 's'

    card.$el.style[transition] = 'all 1s ' + easing('cubicInOut')
    card.$el.style[transitionDelay] = delay / 1000 + 's'

    $xMovement.style[transform] = translate('-500px', 0)
    card.$el.style[transform] = translate(0, '500px')
  }, 0)
  setTimeout(function () {
    card.unmount()
  }, 1000 + delay)
}


// easter eggs end


$shuffle.addEventListener('click', function () {
  deck.shuffle()
  deck.shuffle()
})
$sort.addEventListener('click', function () {
  deck.sort()
})
$bysuit.addEventListener('click', function () {
  deck.sort(true) // sort reversed
  deck.bysuit()
})
$fan.addEventListener('click', function () {
  deck.fan()
})
$poker.addEventListener('click', function () {
  deck.shuffle()
  deck.shuffle()
  deck.shuffle()
  deck.poker()
})

deck.mount($container)

deck.intro()
deck.sort()


// secret message..


var randomDelay = 10000 + 60000 * Math.random()

setTimeout(function () {
  printMessage('Psst..I want to share a secret with you...')
}, randomDelay)

setTimeout(function () {
  printMessage('...try clicking all kings and nothing in between...')
}, randomDelay + 5000)

setTimeout(function () {
  printMessage('...have fun ;)')
}, randomDelay + 10000)

function printMessage (text) {
  var $message = document.createElement('p')
  $message.classList.add('message')
  $message.textContent = text

  document.body.appendChild($message)

  $message.style[transform] = translate(window.innerWidth + 'px', 0)

  setTimeout(function () {
    $message.style[transition] = 'all .7s ' + easing('cubicInOut')
    $message.style[transform] = translate(0, 0)
  }, 1000)

  setTimeout(function () {
    $message.style[transform] = translate(-window.innerWidth + 'px', 0)
  }, 6000)

  setTimeout(function () {
    document.body.removeChild($message)
  }, 7000)
}
