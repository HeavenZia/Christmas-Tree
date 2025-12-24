
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FallingSnow: React.FC = () => {
  const count = 3000;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, speeds, phases, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);
    const cls = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
      spd[i] = 0.02 + Math.random() * 0.06;
      phs[i] = Math.random() * Math.PI * 2;
      
      // Initial white color
      cls[i * 3] = 1;
      cls[i * 3 + 1] = 1;
      cls[i * 3 + 2] = 1;
    }
    return [pos, spd, phs, cls];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const colAttr = meshRef.current.geometry.attributes.color;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);
      
      y -= speeds[i];
      x += Math.sin(time + phases[i]) * 0.01;
      
      if (y < -4) {
        y = 12;
        x = (Math.random() - 0.5) * 25;
        z = (Math.random() - 0.5) * 25;
      }

      posAttr.setXYZ(i, x, y, z);

      // "Dyeing" effect: turns pink if near tree center
      const distSq = x * x + z * z;
      const radiusAtHeight = (12 - y) * 0.25; 
      const isInsideTree = distSq < radiusAtHeight * radiusAtHeight && y < 6 && y > -2;

      if (isInsideTree) {
        // Blend towards pink
        colAttr.setXYZ(i, 1.0, 0.4, 0.7);
      } else {
        // Blend back to white slowly
        const curR = colAttr.getX(i);
        const curG = colAttr.getY(i);
        const curB = colAttr.getZ(i);
        colAttr.setXYZ(i, 
          THREE.MathUtils.lerp(curR, 1.0, 0.05),
          THREE.MathUtils.lerp(curG, 1.0, 0.05),
          THREE.MathUtils.lerp(curB, 1.0, 0.05)
        );
      }
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
