
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import * as THREE from 'three'; 
import { ChristmasTree } from './components/ChristmasTree';
import { UsagiTopper } from './components/UsagiTopper';
import { FallingSnow } from './components/FallingSnow';
import { Ribbons } from './components/Ribbons';
import { SnowyGround } from './components/SnowyGround';

// ==========================================
// 已经替换为你提供的 GitHub MP3 Raw 链接
const MUSIC_URL = 'https://raw.githubusercontent.com/HeavenZia/Christmas-Tree/refs/heads/main/Taylor%20Swift%20-%20Lover.mp3';
// ==========================================

const Scene: React.FC<{ rotationSpeed: number; isPaused: boolean }> = ({ rotationSpeed, isPaused }) => {
  const sceneRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (sceneRef.current && !isPaused) {
      sceneRef.current.rotation.y += delta * (rotationSpeed * (Math.PI / 180));
    }
  });

  return (
    <group ref={sceneRef} position={[2.8, 0, 0]}>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <ChristmasTree />
        <UsagiTopper />
        <Ribbons />
      </Float>
      <SnowyGround />
    </group>
  );
};

const App: React.FC = () => {
  const [rotationSpeed, setRotationSpeed] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = document.getElementById('music1') as HTMLAudioElement;
    audioRef.current = audio;
    
    // 自动加载预设的音乐链接
    if (MUSIC_URL) {
      audio.src = MUSIC_URL;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setRotationSpeed(prev => Math.min(prev + 2, 60));
          break;
        case 'ArrowDown':
          setRotationSpeed(prev => Math.max(prev - 2, 0));
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    const updatePlayStatus = () => setIsPlaying(!audio.paused);
    audio.addEventListener('play', updatePlayStatus);
    audio.addEventListener('pause', updatePlayStatus);

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      audio.removeEventListener('play', updatePlayStatus);
      audio.removeEventListener('pause', updatePlayStatus);
    };
  }, []);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (audio.paused) {
      playPromiseRef.current = audio.play();
      playPromiseRef.current.catch(error => {
        if (error.name !== 'AbortError') console.error("Audio playback failed:", error);
      });
    } else {
      if (playPromiseRef.current !== null) {
        playPromiseRef.current.then(() => {
          audio.pause();
        }).catch(() => {
          audio.pause();
        });
      } else {
        audio.pause();
      }
    }
  };

  return (
    <div className="w-full h-screen relative bg-black select-none overflow-hidden flex items-center px-8 md:px-32">
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 14]} fov={35} />
          <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={0.3} />
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 8, 5]} intensity={10} color="#FFB6C1" distance={30} />
          <spotLight position={[-10, 20, 10]} angle={0.25} penumbra={1} intensity={5} color="#FF1493" />
          <Scene rotationSpeed={rotationSpeed} isPaused={isPaused} />
          <FallingSnow />
          <OrbitControls enablePan={false} minDistance={8} maxDistance={22} autoRotate={false} />
          <fog attach="fog" args={['#000', 12, 40]} />
        </Canvas>
      </div>

      <div className="content relative z-10 pointer-events-none max-w-lg">
        <div className="text-block">
          <h2 data-text="To 崽崽：" className="chinese-font drop-shadow-2xl">
            To 崽崽：
          </h2>
          <h1 data-text="MERRY CHRISTMAS" className="christmas-font drop-shadow-2xl">
            MERRY CHRISTMAS
          </h1>
        </div>
        
        <div className="mt-6 mb-4">
          <p className="chinese-font text-pink-200/90 text-[24px] tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,182,193,0.8)] animate-pulse">
            不要生气啦，永远开心！
          </p>
        </div>

        <p className="text-white/60 tracking-[0.6em] text-[12px] uppercase font-light">
          Wishes for a Pink winter
        </p>
        
        <div className="mt-8 flex flex-col gap-6 pointer-events-auto">
          {/* 播放控制：现在直接控制 GitHub 音乐 */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMusic}
              className="group flex items-center gap-3 transition-colors text-pink-300 hover:text-pink-200"
            >
              <div className={`w-10 h-10 rounded-full border border-pink-300/30 flex items-center justify-center bg-pink-500/10 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                 {isPlaying ? '♪' : '▶'}
              </div>
              <div className="flex flex-col items-start">
                <p className="text-[10px] uppercase tracking-widest font-bold">
                  {isPlaying ? 'Now Playing' : 'Click to Play'}
                </p>
                <p className="text-[8px] opacity-60 uppercase tracking-widest mt-0.5">
                  Taylor Swift - Lover
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2 text-white/30 text-[10px] uppercase tracking-widest font-mono">
        <div>Rotation: {rotationSpeed}°/s</div>
        <div>↑/↓ to Speed | Space to Pause</div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.9)_100%)]" />
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
