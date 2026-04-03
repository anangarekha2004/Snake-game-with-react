import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Loader2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_TRACKS, Track } from '@/src/constants';
import { generateMusic } from '@/src/services/musicService';
import { cn } from '@/src/lib/utils';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState<{ [key: string]: string }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioUrls[currentTrack.id]) {
        setIsLoading(true);
        try {
          const { audioUrl } = await generateMusic(currentTrack.prompt);
          setAudioUrls(prev => ({ ...prev, [currentTrack.id]: audioUrl }));
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
          }
        } catch (error) {
          console.error("Failed to generate music", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(true);
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentTrackIndex + 1) % DUMMY_TRACKS.length;
    } else {
      nextIndex = (currentTrackIndex - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrls[DUMMY_TRACKS[nextIndex].id] || '';
    }
  };

  useEffect(() => {
    if (audioUrls[currentTrack.id] && audioRef.current) {
      audioRef.current.src = audioUrls[currentTrack.id];
      if (isPlaying) audioRef.current.play();
    }
  }, [currentTrackIndex, audioUrls]);

  return (
    <div className="w-full max-w-md p-6 bg-void border-4 border-magenta shadow-[8px_8px_0_#00ffff]">
      <audio 
        ref={audioRef} 
        onEnded={() => skipTrack('next')}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex flex-col gap-8">
        <div className="relative aspect-square brutal-border overflow-hidden group">
          <motion.img 
            key={currentTrack.id}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale contrast-150"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-cyan/20 mix-blend-overlay" />
          
          {isLoading && (
            <div className="absolute inset-0 bg-void/80 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-cyan animate-spin" />
              <span className="text-[8px] font-pixel text-cyan uppercase tracking-widest animate-pulse">SYNTHESIZING...</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 font-pixel">
          <motion.h3 
            key={`title-${currentTrack.id}`}
            className="text-lg text-cyan glitch-text"
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={`artist-${currentTrack.id}`}
            className="text-[8px] text-magenta uppercase tracking-widest"
          >
            {`[SOURCE: ${currentTrack.artist}]`}
          </motion.p>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => skipTrack('prev')}
            className="p-2 text-cyan hover:text-magenta transition-colors"
          >
            <SkipBack className="w-8 h-8" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            disabled={isLoading}
            className="brutal-button w-20 h-20 flex items-center justify-center"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button 
            onClick={() => skipTrack('next')}
            className="p-2 text-cyan hover:text-magenta transition-colors"
          >
            <SkipForward className="w-8 h-8" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[8px] font-mono text-cyan/60 uppercase">
            <span>BIT_RATE: 320KBPS</span>
            <span>{currentTrack.duration}</span>
          </div>
          <div className="h-2 bg-void border border-cyan/30 overflow-hidden">
            <motion.div 
              animate={{ width: isPlaying ? '100%' : '0%' }}
              transition={{ duration: 30, ease: 'linear' }}
              className="h-full bg-cyan"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
