export enum Suit {
  Hearts = '♥',
  Diamonds = '♦',
  Clubs = '♣',
  Spades = '♠',
}

export enum Rank {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
}

export enum CardStatus {
  InCircle = 'IN_CIRCLE',
  Selected = 'SELECTED', // The one card currently shown in the center
  Removed = 'REMOVED',   // Removed from play (thrown on table)
}

export enum Theme {
  Dark = 'DARK',
  Classic = 'CLASSIC',
}

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
  status: CardStatus;
  initialIndex: number; // Original sort order
  layoutIndex: number;  // Current visual position in the circle (mutable)
  
  // Visual Randomness (The "Messy" Factor)
  randomRotation: number; // Slight rotation jitter
  randomRadius: number;   // Slight push in/out

  // Discard Pile Randomness (Where it lands after being thrown)
  discardRotation: number;
  discardX: number; 
  discardY: number;
  discardIndex: number; // Order of discard, -1 if not discarded
}