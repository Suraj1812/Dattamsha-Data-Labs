import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function NeuralMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    camera.position.z = 9;
    camera.lookAt(0, 0, 0);
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.012;
      groupRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.26} />
      <pointLight position={[2, 3, 4]} color="#67d8ff" intensity={9} distance={16} />
      <pointLight position={[-4, -2, 2]} color="#2dd4bf" intensity={6} distance={14} />

      <mesh rotation={[Math.PI / 2.35, 0.1, 0]} position={[0, 0, -2.1]}>
        <torusGeometry args={[2.9, 0.02, 14, 120]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, 0.2, -0.8]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial
          color="#4cc9f0"
          metalness={0.3}
          roughness={0.55}
          emissive="#0b3550"
          emissiveIntensity={0.04}
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const points = useMemo(() => {
    const p = new Float32Array(1800);
    for (let i = 0; i < p.length; i += 3) {
      p[i] = (Math.random() - 0.5) * 24;
      p[i + 1] = (Math.random() - 0.5) * 16;
      p[i + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.003;
    ref.current.rotation.x = 0;
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled>
      <PointMaterial transparent size={0.022} sizeAttenuation depthWrite={false} color="#7dd3fc" opacity={0.3} />
    </Points>
  );
}

export default function ThreeBackground() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!media.matches && window.innerWidth > 900);
    update();
    media.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      media.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="three-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 9], fov: 55 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#020817', 8, 26]} />
        <NeuralMesh />
        <ParticleField />
      </Canvas>
    </div>
  );
}
