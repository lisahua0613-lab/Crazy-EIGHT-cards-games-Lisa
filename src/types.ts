export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type GameStatus = 'dealing' | 'playing' | 'selecting_suit' | 'game_over';
export type Turn = 'player' | 'ai';

export interface GameState {
  deck: CardData[];
  playerHand: CardData[];
  aiHand: CardData[];
  discardPile: CardData[];
  currentTurn: Turn;
  status: GameStatus;
  wildSuit: Suit | null;
  winner: Turn | null;
}
