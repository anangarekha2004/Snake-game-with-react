import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 80;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);
  const trailIdRef = useRef(0);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setTrail([]);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        const tail = newSnake.pop();
        if (tail) {
          setTrail(prev => [
            { ...tail, id: trailIdRef.current++ },
            ...prev.slice(0, 7)
          ]);
        }
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-void border-4 border-cyan shadow-[8px_8px_0_#ff00ff]">
      <div className="flex justify-between w-full items-center px-2 font-pixel">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] text-magenta uppercase tracking-tighter">DATA_SCORE</span>
          <span className="text-2xl text-cyan glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[8px] text-cyan uppercase tracking-tighter">MAX_RECORD</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-magenta" />
            <span className="text-2xl text-magenta glitch-text" data-text={highScore.toString().padStart(4, '0')}>
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-void border-2 border-cyan/50 overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-10">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan" />
          ))}
        </div>

        {/* Trail */}
        <AnimatePresence>
          {trail.map((t, i) => (
            <motion.div
              key={`trail-${t.id}`}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full bg-magenta/40"
              style={{
                gridColumnStart: t.x + 1,
                gridRowStart: t.y + 1,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ x: 0, y: 0 }}
            className={cn(
              "w-full h-full z-10",
              i === 0 
                ? "bg-cyan shadow-[0_0_15px_#00ffff]" 
                : "bg-cyan/60"
            )}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            opacity: [1, 0.5, 1],
            scale: [1, 0.8, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="w-full h-full bg-magenta shadow-[0_0_15px_#ff00ff]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-void/90 flex flex-col items-center justify-center gap-6 z-20"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-2xl font-pixel text-magenta glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                  <button 
                    onClick={resetGame}
                    className="brutal-button"
                  >
                    REBOOT_SYSTEM
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-pixel text-cyan glitch-text" data-text="HALTED">HALTED</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="brutal-button"
                  >
                    RESUME_PROCESS
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[8px] font-mono text-cyan/40 flex flex-col items-center gap-1 uppercase tracking-widest">
        <p>{`[INPUT_MAP: WASD_ARROWS]`}</p>
        <p>{`[INTERRUPT: SPACE]`}</p>
      </div>
    </div>
  );
}
