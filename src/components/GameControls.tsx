"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatTime } from '@/lib/gameUtils';
import { GameState, GameScore } from '@/lib/gameUtils';

interface GameControlsProps {
  moves: number;
  time: number;
  collectedPairs: number;
  totalPairs: number;
  bestScore: GameScore | null;
  gameState: GameState;
  onNewGame: () => void;
}

export default function GameControls({
  moves,
  time,
  collectedPairs,
  totalPairs,
  bestScore,
  gameState,
  onNewGame
}: GameControlsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 md:p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Moves */}
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">
              {moves}
            </div>
            <div className="text-purple-200 text-sm md:text-base">
              Moves
            </div>
          </div>

          {/* Time */}
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">
              {formatTime(time)}
            </div>
            <div className="text-purple-200 text-sm md:text-base">
              Time
            </div>
          </div>

          {/* Progress */}
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-300">
              {collectedPairs}/{totalPairs}
            </div>
            <div className="text-purple-200 text-sm md:text-base">
              Pairs Found
            </div>
          </div>

          {/* Best Score */}
          <div className="text-center">
            {bestScore ? (
              <>
                <div className="text-xl md:text-2xl font-bold text-yellow-300">
                  {bestScore.moves}m / {formatTime(bestScore.time)}
                </div>
                <div className="text-purple-200 text-sm md:text-base">
                  Best Score
                </div>
              </>
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold text-gray-400">
                  --
                </div>
                <div className="text-purple-200 text-sm md:text-base">
                  Best Score
                </div>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Game Status */}
          <div className="flex items-center gap-2">
            <div 
              className={`
                w-3 h-3 rounded-full
                ${gameState === 'playing' ? 'bg-green-400 animate-pulse' : ''}
                ${gameState === 'waiting' ? 'bg-yellow-400' : ''}
                ${gameState === 'complete' ? 'bg-blue-400' : ''}
                ${gameState === 'paused' ? 'bg-gray-400' : ''}
              `}
            />
            <span className="text-white capitalize font-medium">
              {gameState === 'waiting' && 'Ready to Start'}
              {gameState === 'playing' && 'Game in Progress'}
              {gameState === 'complete' && 'Game Complete'}
              {gameState === 'paused' && 'Game Paused'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onNewGame}
              variant="outline"
              className="
                bg-white/20 hover:bg-white/30 
                border-white/30 hover:border-white/40
                text-white hover:text-white
                backdrop-blur-sm
              "
            >
              New Game
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200 text-sm">Game Progress</span>
            <span className="text-purple-200 text-sm">
              {Math.round((collectedPairs / totalPairs) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 transition-all duration-300"
              style={{ width: `${(collectedPairs / totalPairs) * 100}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}