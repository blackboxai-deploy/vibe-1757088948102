"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTime } from '@/lib/gameUtils';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: number;
  time: number;
  isNewBest: boolean;
  onNewGame: () => void;
}

export default function VictoryModal({
  isOpen,
  onClose,
  moves,
  time,
  isNewBest,
  onNewGame
}: VictoryModalProps) {
  const getPerformanceRating = () => {
    if (moves <= 12) return { rating: 'Perfect', color: 'bg-yellow-500', emoji: '🏆' };
    if (moves <= 18) return { rating: 'Excellent', color: 'bg-green-500', emoji: '⭐' };
    if (moves <= 24) return { rating: 'Great', color: 'bg-blue-500', emoji: '🎯' };
    if (moves <= 30) return { rating: 'Good', color: 'bg-purple-500', emoji: '👍' };
    return { rating: 'Keep Trying', color: 'bg-gray-500', emoji: '💪' };
  };

  const performance = getPerformanceRating();

  const handleNewGame = () => {
    onClose();
    onNewGame();
  };

  const handleShare = async () => {
    const shareText = `I just completed a Memory Match Pairs game in ${moves} moves and ${formatTime(time)}! 🎮✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Memory Match Pairs Victory!',
          text: shareText
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard?.writeText(shareText);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard?.writeText(shareText);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-white/20">
        <DialogHeader className="text-center">
          <div className="text-6xl mb-4 animate-bounce">
            🎉
          </div>
          <DialogTitle className="text-3xl font-bold text-white mb-2">
            Congratulations!
          </DialogTitle>
          <DialogDescription className="text-purple-200 text-lg">
            You found all 8 pairs and won the game!
          </DialogDescription>
        </DialogHeader>

        {/* Victory Stats */}
        <div className="space-y-4 my-6">
          {/* Performance Badge */}
          <div className="text-center">
            <Badge 
              className={`
                ${performance.color} text-white text-lg px-4 py-2 mb-2
                shadow-lg border-0
              `}
            >
              <span className="mr-2">{performance.emoji}</span>
              {performance.rating}
            </Badge>
            {isNewBest && (
              <div className="mt-2">
                <Badge className="bg-yellow-600 text-white text-sm px-3 py-1 animate-pulse">
                  🎊 New Best Score! 🎊
                </Badge>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-white mb-1">
                {moves}
              </div>
              <div className="text-purple-200 text-sm">
                Total Moves
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-white mb-1">
                {formatTime(time)}
              </div>
              <div className="text-purple-200 text-sm">
                Time Taken
              </div>
            </div>
          </div>

          {/* Achievement Messages */}
          <div className="text-center space-y-2">
            {moves <= 12 && (
              <p className="text-yellow-300 font-semibold">
                Incredible memory! You're a matching master! 🧠✨
              </p>
            )}
            {moves > 12 && moves <= 18 && (
              <p className="text-green-300 font-semibold">
                Excellent performance! Well done! 🌟
              </p>
            )}
            {moves > 18 && moves <= 24 && (
              <p className="text-blue-300 font-semibold">
                Great job! You've got good memory skills! 🎯
              </p>
            )}
            {time <= 60 && (
              <p className="text-cyan-300">
                Lightning fast! ⚡
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleNewGame}
            className="
              flex-1 bg-gradient-to-r from-purple-600 to-blue-600 
              hover:from-purple-700 hover:to-blue-700
              text-white font-semibold
              shadow-lg transform transition-all
              hover:scale-105 active:scale-95
            "
          >
            🎮 Play Again
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="
              flex-1 bg-white/20 hover:bg-white/30 
              border-white/30 hover:border-white/40
              text-white hover:text-white
              backdrop-blur-sm
            "
          >
            📱 Share Score
          </Button>
        </div>

        {/* Fun Fact */}
        <div className="text-center mt-4 text-purple-200 text-sm">
          🎲 Ready for another challenge? Try to beat your record!
        </div>
      </DialogContent>
    </Dialog>
  );
}