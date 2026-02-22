import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCrazyEights } from '../hooks/useCrazyEights';
import { Card } from './Card';
import { SUITS, SUIT_SYMBOLS, SUIT_COLORS } from '../constants';
import { Suit } from '../types';
import { RefreshCw, Trophy, Info, ChevronDown } from 'lucide-react';

export const GameBoard: React.FC = () => {
  const { state, initGame, playCard, drawCard, isPlayable, selectWildSuit } = useCrazyEights();

  React.useEffect(() => {
    initGame();
  }, [initGame]);

  const topDiscard = state.discardPile[state.discardPile.length - 1];

  return (
    <div className="relative w-full h-screen felt-bg flex flex-col overflow-hidden font-sans">
      {/* Header / Info */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Current Turn</span>
            <span className={`text-sm font-bold ${state.currentTurn === 'player' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {state.currentTurn === 'player' ? 'YOUR TURN' : 'AI THINKING...'}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Deck</span>
            <span className="text-sm font-mono font-bold">{state.deck.length}</span>
          </div>
        </div>

        <button 
          onClick={() => initGame()}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* AI Hand */}
      <div className="h-1/4 flex items-center justify-center pt-12">
        <div className="flex -space-x-12 sm:-space-x-16">
          {state.aiHand.map((card, index) => (
            <Card 
              key={card.id} 
              card={card} 
              isFaceUp={false} 
              className="rotate-180"
              style={{ zIndex: index }}
            />
          ))}
        </div>
      </div>

      {/* Center Area (Deck & Discard) */}
      <div className="flex-grow flex items-center justify-center gap-8 sm:gap-16">
        {/* Draw Pile */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-white/5 rounded-xl blur-xl group-hover:bg-white/10 transition-all" />
          <div 
            onClick={() => state.currentTurn === 'player' && state.status === 'playing' && drawCard('player')}
            className={`
              relative cursor-pointer transition-transform active:scale-95
              ${state.currentTurn === 'player' && state.status === 'playing' ? 'hover:-translate-y-1' : 'opacity-80 grayscale cursor-not-allowed'}
            `}
          >
            {state.deck.length > 0 ? (
              <>
                <div className="absolute top-1 left-1 w-20 h-28 sm:w-24 sm:h-36 bg-indigo-900 rounded-lg translate-x-1 translate-y-1" />
                <Card card={state.deck[0]} isFaceUp={false} />
              </>
            ) : (
              <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
                <span className="text-white/20 text-xs font-bold uppercase tracking-tighter">Empty</span>
              </div>
            )}
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Draw Pile</span>
            </div>
          </div>
        </div>

        {/* Discard Pile */}
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {topDiscard && (
              <motion.div
                key={topDiscard.id}
                initial={{ x: 100, opacity: 0, rotate: 15 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              >
                <Card card={topDiscard} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {state.wildSuit && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Wild:</span>
              <span className={`text-lg ${SUIT_COLORS[state.wildSuit]}`}>{SUIT_SYMBOLS[state.wildSuit]}</span>
            </div>
          )}
          
          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Discard</span>
          </div>
        </div>
      </div>

      {/* Player Hand */}
      <div className="h-1/3 flex items-end justify-center pb-8 px-4">
        <div className="flex flex-wrap justify-center -space-x-8 sm:-space-x-12 max-w-4xl">
          {state.playerHand.map((card, index) => (
            <Card 
              key={card.id} 
              card={card} 
              isPlayable={state.currentTurn === 'player' && state.status === 'playing' && isPlayable(card)}
              onClick={() => playCard(card, 'player')}
              style={{ zIndex: index }}
            />
          ))}
        </div>
      </div>

      {/* Suit Selector Overlay */}
      <AnimatePresence>
        {state.status === 'selecting_suit' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a1c1e] border border-white/10 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl"
            >
              <h2 className="text-3xl font-serif italic mb-2 text-white">Crazy 8!</h2>
              <p className="text-slate-400 mb-8">Select a new suit to continue</p>
              
              <div className="grid grid-cols-2 gap-4">
                {SUITS.map((suit) => (
                  <button
                    key={suit}
                    onClick={() => selectWildSuit(suit)}
                    className={`
                      flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 
                      bg-white/5 hover:bg-white/10 transition-all group active:scale-95
                    `}
                  >
                    <span className={`text-5xl mb-2 transition-transform group-hover:scale-125 ${SUIT_COLORS[suit]}`}>
                      {SUIT_SYMBOLS[suit]}
                    </span>
                    <span className="text-xs uppercase tracking-widest font-bold text-white/40 group-hover:text-white/80">
                      {suit}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {state.status === 'game_over' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, rotateX: 45 }}
              animate={{ scale: 1, rotateX: 0 }}
              className="bg-white text-slate-900 p-12 rounded-[40px] max-w-md w-full text-center shadow-[0_0_100px_rgba(255,255,255,0.1)]"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${state.winner === 'player' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                <Trophy className="w-10 h-10" />
              </div>
              
              <h2 className="text-5xl font-serif italic mb-4">
                {state.winner === 'player' ? 'You Won!' : 'AI Won!'}
              </h2>
              <p className="text-slate-500 mb-10 leading-relaxed">
                {state.winner === 'player' 
                  ? 'Impressive strategy! You cleared your hand before the AI could react.' 
                  : 'The AI outplayed you this time. Ready for a rematch?'}
              </p>
              
              <button
                onClick={() => initGame()}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Hint */}
      <div className="sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 pointer-events-none">
        <ChevronDown className="w-4 h-4 animate-bounce" />
        <span className="text-[8px] uppercase tracking-widest font-bold">Your Hand</span>
      </div>
    </div>
  );
};
