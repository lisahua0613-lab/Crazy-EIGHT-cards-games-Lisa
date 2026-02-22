import { useState, useCallback, useEffect } from 'react';
import { CardData, GameState, Suit, Turn } from '../types';
import { createDeck, shuffleDeck } from '../constants';

export const useCrazyEights = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentTurn: 'player',
    status: 'dealing',
    wildSuit: null,
    winner: null,
  });

  const initGame = useCallback(() => {
    const fullDeck = shuffleDeck(createDeck());
    const playerHand = fullDeck.slice(0, 8);
    const aiHand = fullDeck.slice(8, 16);
    const remainingDeck = fullDeck.slice(16);
    
    // First card cannot be an 8 for simplicity in initial state
    let firstCardIndex = 0;
    while (remainingDeck[firstCardIndex].rank === '8') {
      firstCardIndex++;
    }
    
    const firstCard = remainingDeck.splice(firstCardIndex, 1)[0];
    
    setState({
      deck: remainingDeck,
      playerHand,
      aiHand,
      discardPile: [firstCard],
      currentTurn: 'player',
      status: 'playing',
      wildSuit: null,
      winner: null,
    });
  }, []);

  const isPlayable = useCallback((card: CardData) => {
    const topCard = state.discardPile[state.discardPile.length - 1];
    if (card.rank === '8') return true;
    
    const targetSuit = state.wildSuit || topCard.suit;
    return card.suit === targetSuit || card.rank === topCard.rank;
  }, [state.discardPile, state.wildSuit]);

  const playCard = useCallback((card: CardData, turn: Turn, selectedWildSuit?: Suit) => {
    setState(prev => {
      const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
      const newHand = prev[handKey].filter(c => c.id !== card.id);
      const newDiscardPile = [...prev.discardPile, card];
      
      let nextStatus = prev.status;
      let nextWildSuit = null;
      let nextTurn = turn === 'player' ? 'ai' : 'player';

      if (card.rank === '8') {
        if (turn === 'player' && !selectedWildSuit) {
          nextStatus = 'selecting_suit';
          // Don't change turn yet, wait for suit selection
          return {
            ...prev,
            [handKey]: newHand,
            discardPile: newDiscardPile,
            status: 'selecting_suit',
          };
        } else {
          nextWildSuit = selectedWildSuit || null;
        }
      }

      // Check for winner
      if (newHand.length === 0) {
        return {
          ...prev,
          [handKey]: newHand,
          discardPile: newDiscardPile,
          status: 'game_over',
          winner: turn,
        };
      }

      return {
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        currentTurn: nextTurn as Turn,
        status: 'playing',
        wildSuit: nextWildSuit,
      };
    });
  }, []);

  const selectWildSuit = useCallback((suit: Suit) => {
    setState(prev => ({
      ...prev,
      wildSuit: suit,
      status: 'playing',
      currentTurn: 'ai',
    }));
  }, []);

  const drawCard = useCallback((turn: Turn) => {
    setState(prev => {
      if (prev.deck.length === 0) {
        // Skip turn if deck is empty
        return {
          ...prev,
          currentTurn: turn === 'player' ? 'ai' : 'player',
        };
      }

      const newDeck = [...prev.deck];
      const card = newDeck.pop()!;
      const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
      const newHand = [...prev[handKey], card];

      return {
        ...prev,
        deck: newDeck,
        [handKey]: newHand,
        currentTurn: turn === 'player' ? 'ai' : 'player',
      };
    });
  }, []);

  // AI Logic
  useEffect(() => {
    if (state.status === 'playing' && state.currentTurn === 'ai' && !state.winner) {
      const timer = setTimeout(() => {
        const playableCards = state.aiHand.filter(isPlayable);
        
        if (playableCards.length > 0) {
          // AI Strategy: Play non-8 cards first, otherwise play 8
          const nonEight = playableCards.find(c => c.rank !== '8');
          const cardToPlay = nonEight || playableCards[0];
          
          let aiSelectedSuit: Suit | undefined;
          if (cardToPlay.rank === '8') {
            // Pick suit AI has most of
            const suitCounts = state.aiHand.reduce((acc, c) => {
              acc[c.suit] = (acc[c.suit] || 0) + 1;
              return acc;
            }, {} as Record<Suit, number>);
            
            aiSelectedSuit = (Object.keys(suitCounts) as Suit[]).sort((a, b) => suitCounts[b] - suitCounts[a])[0] || 'hearts';
          }
          
          playCard(cardToPlay, 'ai', aiSelectedSuit);
        } else {
          drawCard('ai');
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [state.status, state.currentTurn, state.aiHand, isPlayable, playCard, drawCard, state.winner]);

  return {
    state,
    initGame,
    playCard,
    drawCard,
    isPlayable,
    selectWildSuit,
  };
};
