
var $container = document.getElementById('container')
var $topbar = document.getElementById('topbar')

var $sort = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $fan = document.createElement('button')

var deck = Deck()

$shuffle.textContent = 'Shuffle'
$sort.textContent = 'Sort'
$bysuit.textContent = 'By suit'
$fan.textContent = 'Fan'

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

$topbar.appendChild($shuffle)
$topbar.appendChild($sort)
$topbar.appendChild($bysuit)
$topbar.appendChild($fan)

deck.mount($container)
