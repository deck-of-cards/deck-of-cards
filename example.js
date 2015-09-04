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
$poker.addEventListener('click', function () {
  deck.poker()
})

deck.mount($container)
