import { Music, Gamepad2, Zap, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden selection:bg-magenta selection:text-void">
      {/* CRT & Glitch Overlays */}
      <div className="scanline" />
      <div className="crt-overlay" />
      <div className="noise" />
      
      <header className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-12 gap-6 z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-cyan flex items-center justify-center brutal-border">
            <Zap className="w-10 h-10 text-void fill-current" />
          </div>
          <div>
            <h1 
              className="text-4xl font-pixel tracking-tighter uppercase text-cyan glitch-text"
              data-text="NEON_RHYTHM"
            >
              NEON_RHYTHM
            </h1>
            <p className="text-[10px] font-mono text-magenta uppercase tracking-[0.3em] mt-2">
              [SYSTEM_STATUS: OPERATIONAL]
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-cyan/70">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">KERNEL_V.7.0.1</span>
          </div>
          <div className="flex items-center gap-2 text-magenta/70">
            <Music className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">AUDIO_STREAM: ACTIVE</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start z-10">
        {/* Left Sidebar - Cryptic Data */}
        <div className="hidden lg:flex lg:col-span-2 flex-col gap-6">
          <div className="p-4 bg-void border-2 border-cyan/30 font-mono text-[10px] text-cyan/60">
            <h4 className="text-magenta mb-4 tracking-widest underline underline-offset-4">LOG_STREAM</h4>
            <div className="space-y-1 overflow-hidden h-40">
              <p>{`> INITIALIZING_CORE...`}</p>
              <p>{`> LOADING_ASSETS...`}</p>
              <p>{`> SYNCING_NEURAL_NET...`}</p>
              <p className="text-magenta">{`> WARNING: BUFFER_OVERFLOW`}</p>
              <p>{`> RETRYING_CONNECTION...`}</p>
              <p>{`> ACCESS_GRANTED`}</p>
              <p className="animate-pulse">{`> _`}</p>
            </div>
          </div>
          
          <div className="p-4 bg-void border-2 border-magenta/30 font-mono text-[10px] text-magenta/60">
            <h4 className="text-cyan mb-4 tracking-widest underline underline-offset-4">HARDWARE_METRICS</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>CORE_TEMP</span>
                <span className="text-cyan">42°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span>VOLTAGE</span>
                <span className="text-cyan">1.2V</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Snake Game */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-2 bg-void brutal-border"
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right - Music Player */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <MusicPlayer />
          </motion.div>
        </div>
      </main>

      <footer className="mt-16 text-[10px] font-mono text-cyan/40 uppercase tracking-[0.5em] z-10 flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <span>[ID: 0x583108632607]</span>
          <span>[LOC: ASIA-SE1]</span>
        </div>
        <p className="glitch-text" data-text="NO_FUTURE_NO_PAST">NO_FUTURE_NO_PAST</p>
      </footer>
    </div>
  );
}
