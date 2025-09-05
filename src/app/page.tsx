"use client";

import { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import CollectionTray from '@/components/CollectionTray';
import GameControls from '@/components/GameControls';
import VictoryModal from '@/components/VictoryModal';
import { useMemoryGame } from '@/hooks/useMemoryGame';
import '@/styles/animations.css';

export default function Home() {
  const {
    cards,
    flippedCards,
    matchedPairs,
    collectedPairs,
    moves,
    time,
    gameState,
    isGameComplete,
    handleCardClick,
    startNewGame,
    bestScore
  } = useMemoryGame();

  const [showVictory, setShowVictory] = useState(false);

  useEffect(() => {
    if (isGameComplete && !showVictory) {
      // Delay victory modal to allow final collection animation
      setTimeout(() => setShowVictory(true), 1000);
    }
  }, [isGameComplete, showVictory]);

  const handleNewGame = () => {
    setShowVictory(false);
    startNewGame();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-wider">
            Match Pairs
          </h1>
          <p className="text-purple-200 text-lg md:text-xl">
            Find all 8 emoji pairs to win!
          </p>
        </div>

        {/* Game Controls */}
        <GameControls
          moves={moves}
          time={time}
          collectedPairs={collectedPairs.length}
          totalPairs={8}
          bestScore={bestScore}
          gameState={gameState}
          onNewGame={handleNewGame}
        />

        {/* Game Board */}
        <div className="mb-8">
          <GameBoard
            cards={cards}
            flippedCards={flippedCards}
            matchedPairs={matchedPairs}
            onCardClick={handleCardClick}
            gameState={gameState}
          />
        </div>

        {/* Collection Tray */}
        <CollectionTray
          collectedPairs={collectedPairs}
          totalPairs={8}
        />

        {/* Victory Modal */}
        <VictoryModal
          isOpen={showVictory}
          onClose={() => setShowVictory(false)}
          moves={moves}
          time={time}
          isNewBest={bestScore === null || (moves < bestScore.moves || time < bestScore.time)}
          onNewGame={handleNewGame}
        />
      </div>
    </main>
  );
}