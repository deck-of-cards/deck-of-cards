
import fisherYates from './fisher-yates'

export default function (deck) {

  deck.shuffle = deck.queued(shuffle)

  function shuffle (next) {
    var cards = deck.cards

    fisherYates(cards)

    cards.forEach(function (card, i) {
      card.pos = i

      card.shuffle(function (i) {
        if (i === 51) {
          next()
        }
      })
    })
    return
  }
}
