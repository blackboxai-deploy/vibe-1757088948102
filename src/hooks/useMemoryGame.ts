"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Card, 
  GameState, 
  GameScore, 
  generateCards, 
  cardsMatch, 
  saveBestScore, 
  loadBestScore,
  ANIMATION_DURATIONS 
} from '@/lib/gameUtils';

export interface CollectedPair {
  id: string;
  emoji: string;
  collectedAt: number;
}

export function useMemoryGame() {
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [collectedPairs, setCollectedPairs] = useState<CollectedPair[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [bestScore, setBestScore] = useState<GameScore | null>(null);

  // Refs for cleanup
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flipBackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize game
  const initializeGame = useCallback(() => {
    const newCards = generateCards();
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setCollectedPairs([]);
    setMoves(0);
    setTime(0);
    setGameState('waiting');
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    // Clear any existing timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (flipBackTimeoutRef.current) clearTimeout(flipBackTimeoutRef.current);
    if (collectionTimeoutRef.current) clearTimeout(collectionTimeoutRef.current);
    
    initializeGame();
  }, [initializeGame]);

  // Start timer
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    
    timerRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  }, []);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Handle card click
  const handleCardClick = useCallback((clickedCard: Card) => {
    console.log('🎮 Game received card click:', {
      emoji: clickedCard.emoji,
      id: clickedCard.id,
      gameState,
      flippedCardsCount: flippedCards.length,
      clickedCardState: {
        isFlipped: clickedCard.isFlipped,
        isMatched: clickedCard.isMatched,
        isCollecting: clickedCard.isCollecting,
        isCollected: clickedCard.isCollected
      }
    });

    // Don't allow clicks if game is not active or card is already handled
    if (gameState === 'complete' || gameState === 'paused') {
      console.log('❌ Click rejected - game not active:', gameState);
      return;
    }
    if (clickedCard.isFlipped || clickedCard.isMatched || clickedCard.isCollecting || clickedCard.isCollected) {
      console.log('❌ Click rejected - card already handled:', {
        isFlipped: clickedCard.isFlipped,
        isMatched: clickedCard.isMatched,
        isCollecting: clickedCard.isCollecting,
        isCollected: clickedCard.isCollected
      });
      return;
    }
    if (flippedCards.length >= 2) {
      console.log('❌ Click rejected - too many cards flipped:', flippedCards.length);
      return;
    }

    console.log('✅ Processing card click for:', clickedCard.emoji);

    // Start game on first click
    if (gameState === 'waiting') {
      console.log('🚀 Starting game...');
      setGameState('playing');
      startTimer();
    }

    // Flip the card
    setCards(prev => 
      prev.map(card => 
        card.id === clickedCard.id 
          ? { ...card, isFlipped: true }
          : card
      )
    );

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    // If two cards are flipped, check for match
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = newFlippedCards;
      
      if (cardsMatch(first, second)) {
        // Match found!
        const matchId = `match-${first.emoji}-${Date.now()}`;
        console.log('🎯 Match found!', first.emoji, 'vs', second.emoji);
        
        // Mark cards as matched
        setCards(prev => 
          prev.map(card => 
            (card.id === first.id || card.id === second.id)
              ? { ...card, isMatched: true }
              : card
          )
        );
        
        setMatchedPairs(prev => [...prev, matchId]);
        setFlippedCards([]);
        
        // Start collection animation after brief delay
        collectionTimeoutRef.current = setTimeout(() => {
          console.log('🎪 Starting collection animation for:', first.emoji);
          // Mark cards as collecting
          setCards(prev => 
            prev.map(card => 
              (card.id === first.id || card.id === second.id)
                ? { ...card, isCollecting: true }
                : card
            )
          );
          
          // Mark cards as collected after animation and add to collection tray
          setTimeout(() => {
            console.log('📦 Cards collected:', first.emoji);
            const collectedPair: CollectedPair = {
              id: matchId,
              emoji: first.emoji,
              collectedAt: Date.now()
            };
            
            setCollectedPairs(prev => [...prev, collectedPair]);
            
            // Mark cards as collected (they stay in grid but become invisible/empty)
            setCards(prev => 
              prev.map(card => 
                (card.id === first.id || card.id === second.id)
                  ? { ...card, isCollected: true, isCollecting: false }
                  : card
              )
            );
          }, ANIMATION_DURATIONS.COLLECTION_MOVE);
          
        }, ANIMATION_DURATIONS.MATCH_HIGHLIGHT);
        
      } else {
        // No match, flip cards back after delay
        console.log('❌ No match:', first.emoji, 'vs', second.emoji);
        flipBackTimeoutRef.current = setTimeout(() => {
          setCards(prev => 
            prev.map(card => 
              (card.id === first.id || card.id === second.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, ANIMATION_DURATIONS.AUTO_FLIP_BACK);
      }
    }
  }, [gameState, flippedCards, startTimer]);

  // Check if game is complete
  const isGameComplete = collectedPairs.length === 8;

  // Handle game completion
  useEffect(() => {
    if (isGameComplete && gameState === 'playing') {
      console.log('🎉 Game completed!');
      stopTimer();
      setGameState('complete');
      
      // Save best score if this is better
      const currentScore: GameScore = {
        moves,
        time,
        date: new Date().toISOString()
      };
      
      if (!bestScore || 
          moves < bestScore.moves || 
          (moves === bestScore.moves && time < bestScore.time)) {
        setBestScore(currentScore);
        saveBestScore(currentScore);
      }
    }
  }, [isGameComplete, gameState, moves, time, bestScore, stopTimer]);

  // Load best score on mount
  useEffect(() => {
    const saved = loadBestScore();
    if (saved) setBestScore(saved);
    initializeGame();
  }, [initializeGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (flipBackTimeoutRef.current) clearTimeout(flipBackTimeoutRef.current);
      if (collectionTimeoutRef.current) clearTimeout(collectionTimeoutRef.current);
    };
  }, []);

  return {
    cards,
    flippedCards,
    matchedPairs,
    collectedPairs,
    moves,
    time,
    gameState,
    isGameComplete,
    bestScore,
    handleCardClick,
    startNewGame
  };
}