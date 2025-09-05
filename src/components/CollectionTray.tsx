"use client";

import React from 'react';
import { CollectedPair } from '@/hooks/useMemoryGame';

interface CollectionTrayProps {
  collectedPairs: CollectedPair[];
  totalPairs: number;
}

export default function CollectionTray({
  collectedPairs,
  totalPairs
}: CollectionTrayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Tray Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">
          Collection Tray
        </h2>
        <div className="text-purple-200">
          <span className="text-xl font-semibold text-green-300">
            {collectedPairs.length}
          </span>
          <span className="mx-2">/</span>
          <span className="text-xl">
            {totalPairs} pairs collected
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transition-all duration-500 ease-out"
          style={{ 
            width: `${(collectedPairs.length / totalPairs) * 100}%`,
            transition: 'width 0.5s ease-out'
          }}
        />
      </div>

      {/* Collection Grid */}
      <div 
        className="
          bg-white/10 backdrop-blur-sm 
          p-4 md:p-6 
          rounded-xl shadow-2xl 
          border border-white/20
          min-h-[120px]
        "
      >
        {collectedPairs.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center h-24">
            <p className="text-purple-200 text-lg italic">
              Matched pairs will appear here...
            </p>
          </div>
        ) : (
          /* Collected Pairs Grid */
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-md mx-auto">
            {collectedPairs.map((pair, index) => (
              <div
                key={pair.id}
                className="
                  bg-white rounded-lg shadow-md
                  flex items-center justify-center
                  aspect-square
                  border-2 border-green-200
                  animate-fade-in-scale
                "
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div 
                  className="text-2xl md:text-3xl"
                  role="img"
                  aria-label={`Collected pair ${pair.emoji}`}
                >
                  {pair.emoji}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completion Message */}
        {collectedPairs.length === totalPairs && (
          <div className="text-center mt-6">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-xl font-bold text-green-300">
              All pairs collected! Amazing work!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}