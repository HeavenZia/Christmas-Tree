
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Ribbons: React.FC = () => {
  const lineRef = useRef<THREE.Group>(null);

  const ribbonCurves = useMemo(() => {
    const curves = [];
    const ribbonCount = 2;
    
    for (let j = 0; j < ribbonCount; j++) {
      const points = [];
      const heightSteps = 150;
      const spiralSpeed = 5;
      const startAngle = (j / ribbonCount) * Math.PI * 2;

      for (let i = 0; i <= heightSteps; i++) {
        const yNorm = i / heightSteps;
        const height = yNorm * 6.0 - 2.5;
        
        // Match the tree's non-regular silhouette roughly
        const segmentIdx = Math.floor(yNorm * 6);
        const segmentNoise = Math.sin(segmentIdx * 2.5) * 0.25;
        const coneBase = Math.pow(1.1 - yNorm, 1.3) * 2.8;
        const baseRadius = coneBase * (0.85 + segmentNoise) * 1.05; // Slightly outside the tree

        const angle = startAngle + yNorm * Math.PI * spiralSpeed;
        
        points.push(new THREE.Vector3(
          Math.cos(angle) * baseRadius,
          height,
          Math.sin(angle) * baseRadius
        ));
      }
      curves.push(new THREE.CatmullRomCurve3(points));
    }
    return curves;
  }, []);

  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.getElapsedTime();
      lineRef.current.children.forEach((child, idx) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 2 + Math.sin(time * 2 + idx) * 1.5;
        }
      });
    }
  });

  return (
    <group ref={lineRef}>
      {ribbonCurves.map((curve, idx) => (
        <mesh key={idx}>
          <tubeGeometry args={[curve, 150, 0.02, 8, false]} />
          <meshStandardMaterial 
            color={idx % 2 === 0 ? "#FF69B4" : "#FFFFFF"} 
            emissive={idx % 2 === 0 ? "#FF1493" : "#FFC0CB"}
            emissiveIntensity={3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};
