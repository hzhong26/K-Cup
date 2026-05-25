import { CardData, CardStatus, Rank, Suit } from '../types';

export const generateDeck = (): CardData[] => {
  const suits = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];
  const ranks = [
    Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six,
    Rank.Seven, Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King
  ];

  let deck: CardData[] = [];
  let index = 0;

  for (const suit of suits) {
    for (const rank of ranks) {
      // Generate random discard positions (spread across a typical screen area)
      // Range: roughly -600px to +600px for X, -400px to +400px for Y
      const discardX = (Math.random() * 1200) - 600;
      const discardY = (Math.random() * 800) - 400;
      
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank,
        status: CardStatus.InCircle,
        initialIndex: index,
        layoutIndex: index,
        // Messiness Factors
        // Rotation between -6 and 6 degrees
        randomRotation: (Math.random() * 12) - 6, 
        // Radius offset between -12px and 12px
        randomRadius: (Math.random() * 24) - 12,
        // Discard factors
        discardRotation: Math.random() * 360,
        discardX,
        discardY,
        discardIndex: -1
      });
      index++;
    }
  }

  // Shuffle the deck initially so the circle isn't ordered (optional, but better for a game feel)
  return shuffle(deck);
};

// Fisher-Yates shuffle
function shuffle(array: CardData[]): CardData[] {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
    
    // Re-assign initialIndex based on shuffled position so they fan out nicely in order
    // Actually, we want them to look random in the circle, but positions are fixed slots.
    // Let's re-assign the visual index to be 0..51 after shuffle.
    array[currentIndex].initialIndex = currentIndex;
    array[currentIndex].layoutIndex = currentIndex;
  }

  // Correction: We need to re-loop to set the index property correctly after shuffle
  return array.map((card, i) => ({ ...card, initialIndex: i, layoutIndex: i }));
}