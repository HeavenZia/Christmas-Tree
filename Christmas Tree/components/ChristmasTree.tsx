
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ChristmasTree: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  // High particle count for a lush, organic density
  const particleCount = 400000; 

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    
    // Enhanced color palette with more vibrant and deep pinks
    const colors_palette = [
      new THREE.Color('#FFB6C1'), // Light Pink
      new THREE.Color('#FF69B4'), // Hot Pink
      new THREE.Color('#FF1493'), // Deep Pink
      new THREE.Color('#DB7093'), // Pale Violet Red
      new THREE.Color('#FF007F'), // Rose
    ];

    for (let i = 0; i < particleCount; i++) {
      const yNorm = Math.random();
      const height = yNorm * 6.5;
      
      const trunkOffset = Math.sin(yNorm * Math.PI) * 0.15;
      const trunkOffsetZ = Math.cos(yNorm * Math.PI * 0.5) * 0.1;

      const segmentIdx = Math.floor(yNorm * 12); 
      const segmentNoise = Math.sin(segmentIdx * 2.8) * 0.25;
      
      const coneBase = Math.pow(1.15 - yNorm, 1.4) * 3.4; 
      const baseRadius = coneBase * (0.8 + segmentNoise);
      
      const branchAngle = Math.random() * Math.PI * 2;
      const clumpFreq = 4 + Math.floor(yNorm * 6);
      const clumps = (Math.sin(branchAngle * clumpFreq + height * 2) * 0.45) + (Math.cos(branchAngle * 2.5) * 0.15);
      
      const isCore = Math.random() > 0.95;
      let radius, droop;

      if (isCore) {
        radius = Math.random() * baseRadius * 0.2;
        droop = 0;
      } else {
        // Density favor: Shell look
        radius = Math.pow(Math.random(), 0.6) * baseRadius * (1.1 + clumps);
        droop = Math.pow(radius / 3.4, 2.6) * 0.6;
      }

      pos[i * 3] = trunkOffset + Math.cos(branchAngle) * radius;
      pos[i * 3 + 1] = height - 2.5 - droop + (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = trunkOffsetZ + Math.sin(branchAngle) * radius;

      const paletteIdx = Math.floor(Math.random() * colors_palette.length);
      const baseCol = colors_palette[paletteIdx];
      
      // Reduce white mixing to keep it predominantly pink
      const outerFactor = radius / (baseRadius * 1.5);
      const whiteMix = Math.pow(outerFactor, 1.2); // Higher exponent makes white appear only at the extreme tips
      
      // Lerp towards a very soft pink instead of pure white to maintain "Pinkness"
      const finalCol = new THREE.Color().copy(baseCol).lerp(new THREE.Color('#FFF0F5'), whiteMix * 0.4);
      
      cols[i * 3] = finalCol.r;
      cols[i * 3 + 1] = finalCol.g;
      cols[i * 3 + 2] = finalCol.b;
    }
    return [pos, cols];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      pointsRef.current.rotation.y += 0.0003;
      const s = 1 + Math.sin(time * 0.35) * 0.005;
      pointsRef.current.scale.set(s, 1, s);
    }
  });

  return (
    <group>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.12, 6.5, 8]} />
        <meshStandardMaterial color="#2a1217" transparent opacity={0.1} />
      </mesh>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028} 
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
