export interface Card {
  id: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  isCollecting: boolean;
  isCollected: boolean; // New: for cards that have been collected
  position: number;
}

export interface GameScore {
  moves: number;
  time: number;
  date: string;
}

// Emoji sets for the memory game (8 unique emojis for 4x4 grid)
export const EMOJI_SET = [
  '🎯', '🎮', '🎲', '🎪', '🎨', '🎭',
  '🎸', '🎺', '🎷', '🎤', '🎧', '🎵',
  '⚽', '🏀', '🏈', '🎾', '🏐', '🏓',
  '🚀', '🛸', '⭐', '🌟', '✨', '💫',
  '🦄', '🐲', '🦋', '🐙', '🦊', '🐺',
  '🌈', '🔥', '💎', '🎁', '🏆', '👑'
];

// Shuffle array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate cards for 4x4 grid (8 pairs = 16 cards)
export function generateCards(): Card[] {
  // Take first 8 emojis and create pairs
  const selectedEmojis = EMOJI_SET.slice(0, 8);
  const pairedEmojis = [...selectedEmojis, ...selectedEmojis];
  
  // Create card objects
  const cards = pairedEmojis.map((emoji, index) => ({
    id: `card-${index}`,
    emoji,
    isFlipped: false,
    isMatched: false,
    isCollecting: false,
    isCollected: false,
    position: index
  }));

  // Shuffle the cards
  const shuffledCards = shuffleArray(cards);
  
  console.log('Generated cards:', shuffledCards.map(c => ({ id: c.id, emoji: c.emoji, isFlipped: c.isFlipped })));
  
  return shuffledCards;
}

// Format time as MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Calculate score based on moves and time
export function calculateScore(moves: number, time: number): number {
  // Lower is better: base score minus penalties for moves and time
  const baseScore = 10000;
  const movePenalty = moves * 10;
  const timePenalty = time * 5;
  return Math.max(0, baseScore - movePenalty - timePenalty);
}

// Local storage helpers
export function saveBestScore(score: GameScore): void {
  try {
    localStorage.setItem('memoryGameBestScore', JSON.stringify(score));
  } catch (error) {
    console.error('Failed to save best score:', error);
  }
}

export function loadBestScore(): GameScore | null {
  try {
    const saved = localStorage.getItem('memoryGameBestScore');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load best score:', error);
    return null;
  }
}

// Animation timing constants
export const ANIMATION_DURATIONS = {
  CARD_FLIP: 600,
  MATCH_HIGHLIGHT: 500,
  COLLECTION_SPIN: 800,
  COLLECTION_MOVE: 1000,
  AUTO_FLIP_BACK: 1500,
};

// Game states
export type GameState = 'waiting' | 'playing' | 'paused' | 'complete';

// Check if two cards match
export function cardsMatch(card1: Card, card2: Card): boolean {
  return card1.emoji === card2.emoji && card1.id !== card2.id;
}

// Get card position in grid (row, col)
export function getCardGridPosition(position: number): { row: number; col: number } {
  const row = Math.floor(position / 4);
  const col = position % 4;
  return { row, col };
}

// Animation easing functions
export const easings = {
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeOutBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};