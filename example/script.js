let prefix = Deck.prefix;
let transform = prefix('transform');
let translate = Deck.translate;
let deck = Deck(false);
let onTouch = () => {
    //this === card;
    debugger;
};
deck.cards.forEach( (card, index) => {
    card.enableDragging();
    card.enableFlipping();
    card.$el.addEventListener('mousedown', onTouch.bind(card));
    card.$el.addEventListener('touchstart', onTouch.bind(card));
});
deck.mount(document.getElementById("container"));
deck.intro();



class Player {
  constructor(name, stack){
    this.name = name;
    this.stack = stack;
  }
}



const table = new Vue({
  el: '#table',
  data: {
    players: []
  },
  methods: {
    addPlayer(player) {
      this.players.push(player);
    }
  }
});



const playersForm = new Vue({
  el: '#players-form',
  data: {
    name: '',
    stack: ''
  },
  methods: {
    onSubmit() {
      const player = new Player(this.name, this.stack);
      table.addPlayer(player);

      this.name = '';
      this.stack = '';
    }
  }
});
