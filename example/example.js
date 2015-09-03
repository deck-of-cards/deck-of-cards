var $container = document.getElementById('container')
var $topbar = document.getElementById('topbar')

var $sort = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $fan = document.createElement('button')

$shuffle.textContent = 'Shuffle'
$sort.textContent = 'Sort'
$bysuit.textContent = 'By suit'
$fan.textContent = 'Fan'

$topbar.appendChild($shuffle)
$topbar.appendChild($sort)
$topbar.appendChild($bysuit)
$topbar.appendChild($fan)

var deck = Deck()

$shuffle.addEventListener('click', function () {
  deck.shuffle()
})
$sort.addEventListener('click', function () {
  deck.sort()
})
$bysuit.addEventListener('click', function () {
  deck.bysuit()
})
$fan.addEventListener('click', function () {
  deck.fan()
})

deck.mount($container)
