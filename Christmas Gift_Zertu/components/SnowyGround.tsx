
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Bow: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      // Wind sway effect
      groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.08;
      groupRef.current.rotation.x = Math.cos(time * 1.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, size / 2 + 0.02, 0]}>
      {/* Center Knot */}
      <mesh>
        <sphereGeometry args={[size * 0.12, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Loops */}
      {[-1, 1].map((side) => (
        <group key={side} rotation={[0, 0, (Math.PI / 3.5) * side]} position={[size * 0.12 * side, 0, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[size * 0.18, size * 0.05, 12, 24, Math.PI * 1.6]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Metallic Bell Charm */}
      <mesh position={[0, -0.06, size * 0.18]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

const ExquisiteGift: React.FC<{ 
  position: [number, number, number]; 
  color: string; 
  ribbonColor: string; 
  size?: [number, number, number]; 
  rotation?: [number, number, number];
}> = ({ position, color, ribbonColor, size = [0.4, 0.4, 0.4], rotation = [0, 0, 0] }) => {
  const ribbonRef = useRef<THREE.Mesh>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ribbonRef.current && ribbonRef.current.material) {
      (ribbonRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(time * 3) * 0.4;
    }
  });

  // Create beveled shape for the box
  const boxShape = useMemo(() => {
    const shape = new THREE.Shape();
    const [w, h, d] = size;
    const r = 0.04; // radius
    shape.moveTo(-w/2 + r, -h/2);
    shape.lineTo(w/2 - r, -h/2);
    shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
    shape.lineTo(w/2, h/2 - r);
    shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
    shape.lineTo(-w/2 + r, h/2);
    shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
    shape.lineTo(-w/2, -h/2 + r);
    shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
    return shape;
  }, [size]);

  const extrudeSettings = useMemo(() => ({
    depth: size[2],
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  }), [size]);

  return (
    <group position={position} rotation={rotation}>
      {/* Shadow plane on snow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[size[0] * 1.5, size[2] * 1.5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>

      {/* Gift Box Body */}
      <mesh ref={meshRef} position={[0, 0, -size[2]/2]}>
        <extrudeGeometry args={[boxShape, extrudeSettings]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.3} 
          metalness={0.1} 
          envMapIntensity={1}
        />
      </mesh>

      {/* Ribbons */}
      <group>
        {/* Vertical Cross */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[size[0] * 0.18, size[1] + 0.05, size[2] + 0.05]} />
          <meshStandardMaterial ref={ribbonRef} color={ribbonColor} emissive={ribbonColor} emissiveIntensity={0.5} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[size[0] + 0.05, size[1] * 0.18, size[2] + 0.05]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      <Bow color={ribbonColor} size={Math.max(size[0], size[2])} />
      
      {/* Snowflake Embellishments */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[(Math.random()-0.5)*size[0], (Math.random()-0.5)*size[1], size[2]/2 + 0.025]}>
          <circleGeometry args={[0.015, 6]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const ChristmasStocking: React.FC<{ position: [number, number, number], rotation: [number, number, number] }> = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Stocking Body */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.35, 16]} />
        <meshStandardMaterial color="#D11090" roughness={0.9} />
      </mesh>
      {/* Foot Part */}
      <mesh position={[0.1, 0.08, 0]} rotation={[0, 0, Math.PI / 2.2]}>
        <cylinderGeometry args={[0.09, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#D11090" roughness={0.9} />
      </mesh>
      {/* Toe */}
      <mesh position={[0.2, 0.08, 0]}>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Cuff */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.12, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
    </group>
  );
};

const BichonPuppy: React.FC = () => {
  return (
    <group position={[1.2, -2.4, 1.8]} rotation={[0, -Math.PI / 4, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={1} emissive="#ffffff" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 0.38, 0.18]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={1} emissive="#ffffff" emissiveIntensity={0.15} />
      </mesh>
      {/* Legs */}
      {[[-0.14, 0.1], [0.14, 0.1], [-0.14, -0.1], [0.14, -0.1]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]}>
          <cylinderGeometry args={[0.045, 0.045, 0.18, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {/* Eyes & Nose */}
      <mesh position={[-0.07, 0.4, 0.32]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      <mesh position={[0.07, 0.4, 0.32]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      <mesh position={[0, 0.35, 0.35]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};

export const SnowyGround: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Points>(null);

  const groundParticleCount = 160000;
  const ringParticleCount = 90000;

  const [groundPositions, groundColors] = useMemo(() => {
    const pos = new Float32Array(groundParticleCount * 3);
    const cols = new Float32Array(groundParticleCount * 3);
    const radius = 6.0;

    for (let i = 0; i < groundParticleCount; i++) {
      const r = Math.sqrt(Math.random()) * radius;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = -2.5 + (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 2] = r * Math.sin(theta);
      const mixFactor = Math.pow(r / radius, 1.5);
      const col = new THREE.Color('#ffffff').lerp(new THREE.Color('#FFF5F8'), 1 - mixFactor);
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    return [pos, cols];
  }, []);

  const [ringPositions] = useMemo(() => {
    const pos = new Float32Array(ringParticleCount * 3);
    const ringRadii = [1.3, 2.4, 3.6, 4.8, 5.8];
    const particlesPerRing = Math.floor(ringParticleCount / ringRadii.length);
    let idx = 0;
    ringRadii.forEach((baseR) => {
      for (let i = 0; i < particlesPerRing; i++) {
        const theta = Math.random() * Math.PI * 2;
        const drift = (Math.random() - 0.5) * 0.25;
        const r = baseR + drift;
        pos[idx * 3] = r * Math.cos(theta);
        pos[idx * 3 + 1] = -2.48;
        pos[idx * 3 + 2] = r * Math.sin(theta);
        idx++;
      }
    });
    return [pos];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ringRef.current && ringRef.current.material) {
      const scaleFactor = 1 + Math.sin(time * 0.5) * 0.01;
      ringRef.current.scale.set(scaleFactor, 1, scaleFactor);
      (ringRef.current.material as THREE.PointsMaterial).opacity = 0.5 + Math.sin(time * 1.5) * 0.15;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.01;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={groundParticleCount} array={groundPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={groundParticleCount} array={groundColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.018} vertexColors transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>

      <points ref={ringRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={ringParticleCount} array={ringPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>

      {/* Exquisite Scattered Gifts */}
      <ExquisiteGift position={[-1.8, -2.42, 1.5]} color="#E0115F" ribbonColor="#FFD700" size={[0.55, 0.4, 0.45]} rotation={[0, 0.7, 0]} />
      <ExquisiteGift position={[0.6, -2.48, -2.4]} color="#E6E6FA" ribbonColor="#FF69B4" size={[0.7, 0.25, 0.5]} rotation={[0.08, -0.4, 0]} />
      <ExquisiteGift position={[2.6, -2.44, 1.0]} color="#F5F5F5" ribbonColor="#D4AF37" size={[0.45, 0.55, 0.45]} rotation={[0, 1.2, 0.1]} />
      <ExquisiteGift position={[-0.9, -2.42, -2.0]} color="#FFB6C1" ribbonColor="#ffffff" size={[0.35, 0.35, 0.35]} rotation={[0, 1.5, 0]} />
      <ExquisiteGift position={[-2.4, -2.48, -0.6]} color="#D11090" ribbonColor="#FFD700" size={[0.5, 0.38, 0.5]} rotation={[0.06, 0.3, -0.12]} />
      <ExquisiteGift position={[2.0, -2.45, -1.8]} color="#FFE4E1" ribbonColor="#FFA500" size={[0.4, 0.4, 0.4]} rotation={[0, -0.9, 0]} />

      <ChristmasStocking position={[-1.3, -2.5, -0.1]} rotation={[0, 0.4, 0]} />
      <ChristmasStocking position={[2.2, -2.5, -0.9]} rotation={[0, -0.7, 0]} />

      <BichonPuppy />
    </group>
  );
};
