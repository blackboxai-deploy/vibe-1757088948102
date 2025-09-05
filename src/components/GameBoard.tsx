"use client";

import React from 'react';
import MemoryCard from './MemoryCard';
import { Card, GameState } from '@/lib/gameUtils';

interface GameBoardProps {
  cards: Card[];
  flippedCards: Card[];
  matchedPairs: string[];
  onCardClick: (card: Card) => void;
  gameState: GameState;
}

export default function GameBoard({
  cards,
  flippedCards,
  onCardClick,
  gameState
}: GameBoardProps) {
  console.log('🎮 GameBoard render:', {
    gameState,
    cardsCount: cards.length,
    flippedCardsCount: flippedCards.length,
    cardsWithEmojis: cards.map(c => ({ id: c.id, emoji: c.emoji, isFlipped: c.isFlipped, isCollected: c.isCollected }))
  });

  // Create a 4x4 grid array (16 slots) and place cards in their original positions
  const gridSlots = Array(16).fill(null);
  cards.forEach((card) => {
    if (card.position < 16) {
      gridSlots[card.position] = card;
    }
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Game Board Container */}
      <div 
        className="
          grid grid-cols-4 gap-3 md:gap-6 
          bg-white/10 backdrop-blur-sm 
          p-4 md:p-8 
          rounded-xl shadow-2xl 
          border border-white/20
        "
        style={{
          aspectRatio: '1 / 1',
          minHeight: '320px',
          maxWidth: '500px'
        }}
      >
        {gridSlots.map((card, index) => (
          <MemoryCard
            key={card?.id || `empty-${index}`}
            card={card}
            onClick={() => card && onCardClick(card)}
            isDisabled={
              gameState === 'complete' || 
              (card?.isMatched || false) || 
              (card?.isCollecting || false) ||
              (card?.isCollected || false) ||
              flippedCards.length >= 2
            }
            gridPosition={index}
          />
        ))}
      </div>
      
      {/* Game Status */}
      <div className="text-center mt-4">
        {gameState === 'waiting' && (
          <p className="text-purple-200 text-lg">
            Click any card to start the game!
          </p>
        )}
        {gameState === 'playing' && (
          <p className="text-purple-200 text-lg">
            Find matching pairs by flipping cards
          </p>
        )}
        {gameState === 'complete' && (
          <p className="text-green-300 text-xl font-semibold">
            🎉 Congratulations! All pairs found! 🎉
          </p>
        )}
      </div>
    </div>
  );
}