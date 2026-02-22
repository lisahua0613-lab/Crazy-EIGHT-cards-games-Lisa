import React from 'react';
import { motion } from 'motion/react';
import { CardData, Suit } from '../types';
import { SUIT_COLORS, SUIT_SYMBOLS } from '../constants';

interface CardProps {
  card: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  card,
  isFaceUp = true,
  onClick,
  isPlayable = false,
  className = '',
  style,
}) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg cursor-pointer select-none
        ${isFaceUp ? 'bg-white' : 'bg-indigo-700'}
        ${isPlayable ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/20' : 'shadow-md'}
        transition-shadow duration-200
        ${className}
      `}
      style={style}
    >
      {isFaceUp ? (
        <div className="flex flex-col h-full p-1.5 sm:p-2 text-slate-900">
          <div className={`flex justify-between items-start ${SUIT_COLORS[card.suit]}`}>
            <span className="text-sm sm:text-lg font-bold leading-none">{card.rank}</span>
            <span className="text-xs sm:text-base leading-none">{SUIT_SYMBOLS[card.suit]}</span>
          </div>
          
          <div className={`flex-grow flex items-center justify-center text-2xl sm:text-4xl ${SUIT_COLORS[card.suit]}`}>
            {SUIT_SYMBOLS[card.suit]}
          </div>
          
          <div className={`flex justify-between items-end rotate-180 ${SUIT_COLORS[card.suit]}`}>
            <span className="text-sm sm:text-lg font-bold leading-none">{card.rank}</span>
            <span className="text-xs sm:text-base leading-none">{SUIT_SYMBOLS[card.suit]}</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full rounded-lg border-4 border-white/20 flex items-center justify-center">
          <div className="w-12 h-16 sm:w-16 sm:h-24 rounded border-2 border-white/10 flex items-center justify-center">
            <div className="text-white/20 text-2xl font-serif italic">8</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
