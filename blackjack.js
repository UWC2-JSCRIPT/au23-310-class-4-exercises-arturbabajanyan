const getDeck = () => {
  const deck = [];
  const suits = ['hearts', 'spades', 'clubs', 'diamonds'];
  
    for (let index = 0; index < suits.length; index++) {
      // create an array of 13 objects
      for (let j = 1; j <= 13; j++) {
        // for each loop, push a card object to the deck
  
        // special cases for when j > 10
        let displayVal = '';
  
        switch (j) {
          case 1:
            displayVal = 'Ace';
            break
          case 11:
            displayVal = 'Jack';
            break
          case 12:
            displayVal = 'Queen';
            break
          case 13:
            displayVal = 'King';
            break
          case j:
            displayVal = `${j}`;
            break
        }
  
        const card = {
          val: j,
          displayVal: displayVal,
          suit: suits[index],
        }
  
        if (displayVal === 'Ace') {
          card.val = 11;
        }
  
        if (displayVal === 'Jack' || displayVal === 'Queen' || displayVal === 'King') {
          card.val = 10;
        }
  
        deck.push(card);
      }
    }
    // console.log(deck);
    return deck;
  }
  
const playerName = prompt("Please enter your name");

const blackjackDeck = getDeck();

class CardPlayer {
  constructor(name) {
    this.name = name;
    this.hand = [];
  }

  drawCard() {
    const randomIndex = Math.floor(Math.random() * blackjackDeck.length);
    const drawnCard = blackjackDeck[randomIndex];
    this.hand.push(drawnCard);
  }
}

const player = new CardPlayer(playerName);
const dealer = new CardPlayer("Dealer");

console.log(player.name);
console.log(dealer.name);

const calcPoints = (hand) => {
  let total = 0;
  let isSoft = false;

  for (const card of hand) {
    total += card.val;
  }

  for (const card of hand) {
    if (card.val === 1 && total + 10 <= 21) {
      total += 10;
      isSoft = true;
      break;
    }
  }

  return { total, isSoft };
};


const dealerShouldDraw = (dealerHand) => {
  const dealerScore = calcPoints(dealerHand);
    
  if (dealerScore.total <= 16 && !dealerScore.isSoft) {
    return true;
  } else {
    return false;
  }
};


const determineWinner = (playerScore, dealerScore) => {
  if (playerScore > 21) {
    return `Player: ${playerScore} - Dealer: ${dealerScore}. Dealer wins!`;
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    return `Player: ${playerScore} - Dealer: ${dealerScore}. Player wins!`;
  } else if (dealerScore > playerScore) {
    return `Player: ${playerScore} - Dealer: ${dealerScore}. Dealer wins!`;
  } else {
    return `Player: ${playerScore} - Dealer: ${dealerScore}. It's a tie!`;
  }
};


const askForHit = (count, dealerCard) => {
  return `Dealer showing ${dealerCard.displayVal}, your count is ${count}. Draw card?`;
};


const showHand = (player) => {
  const displayHand = player.hand.map((card) => card.displayVal);
  console.log(
    `Player's hand is ${displayHand.join(", ")} (${
      calcPoints(player.hand).total
    })`
  );
};


const startGame = function () {
  player.drawCard();
  dealer.drawCard();
  player.drawCard();
  dealer.drawCard();


  let playerScore = calcPoints(player.hand).total;
  showHand(player);
  
  if (playerScore === 21) {
    return "Player wins with a Blackjack!";
  }
  while (playerScore < 21 && confirm(askForHit(playerScore, dealer.hand[0]))) {
    player.drawCard();
    playerScore = calcPoints(player.hand).total;
    showHand(player);
  }
  if (playerScore > 21) {
    return "You went over 21 - you lose!";
  }
  console.log(`Player stands at ${playerScore}`);

  let dealerScore = calcPoints(dealer.hand).total;
  showHand(dealer)
  // for extra  credit:
  // Check for dealer's blackjack
  // If the dealer draws exactly 21 after drawing her first 2 cards, the dealer immediately wins.
  if (dealerScore === 21) {
    return "Dealer wins with a Blackjack!";
  }
  while (dealerScore < 21 && dealerShouldDraw(dealer.hand)) {
    dealer.drawCard();
    dealerScore = calcPoints(dealer.hand).total;
    showHand(dealer);
  }
  if (dealerScore > 21) {
    return "Dealer went over 21 - you win!";
  }
  console.log(`Dealer stands at ${dealerScore}`);

  return determineWinner(playerScore, dealerScore);
};
console.log(startGame());