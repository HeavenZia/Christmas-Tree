
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const UsagiTopper: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating/rotating animation
      groupRef.current.rotation.y = time * 2;
      groupRef.current.position.y = 4.0 + Math.sin(time * 4) * 0.05;
    }
    if (headRef.current) {
      // Usagi's signature energetic vibe
      headRef.current.rotation.z = Math.sin(time * 10) * 0.05;
    }
  });

  const bodyColor = "#FFF9C4"; // Cream/Pale Yellow
  const cheekColor = "#FFB7C5"; // Pink

  return (
    <group ref={groupRef} position={[0, 4.0, 0]} scale={[0.6, 0.6, 0.6]}>
      {/* Body & Head */}
      <group ref={headRef}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={bodyColor} roughness={0.7} />
        </mesh>

        {/* Ears */}
        {[-1, 1].map((side) => (
          <group key={side} position={[0.2 * side, 0.35, 0]} rotation={[0, 0, 0.1 * side]}>
            <mesh position={[0, 0.4, 0]}>
              <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
              <meshStandardMaterial color={bodyColor} roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Eyes */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[0.22 * side, 0.1, 0.42]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#111111" />
          </mesh>
        ))}

        {/* Cheeks */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[0.35 * side, -0.05, 0.38]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={cheekColor} transparent opacity={0.6} />
          </mesh>
        ))}

        {/* Mouth (simplified as a small inverted v or dot) */}
        <mesh position={[0, -0.05, 0.45]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
      </group>

      {/* Glow effect */}
      <pointLight distance={5} color="#FFF9C4" intensity={8} />
    </group>
  );
};
