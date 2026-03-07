import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function NeuralMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    camera.position.z = 9 + Math.sin(t * 0.15) * 0.25;
    camera.lookAt(0, 0, 0);
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06;
      groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.34} />
      <pointLight position={[2, 3, 4]} color="#67d8ff" intensity={18} distance={18} />
      <pointLight position={[-4, -2, 2]} color="#2dd4bf" intensity={12} distance={16} />

      <Float speed={0.7} rotationIntensity={0.45} floatIntensity={0.35}>
        <mesh position={[0, 0.2, 0]}>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial
            color="#38bdf8"
            metalness={0.45}
            roughness={0.35}
            emissive="#0b3550"
            emissiveIntensity={0.12}
            wireframe
          />
        </mesh>
      </Float>

      <Float speed={0.55} rotationIntensity={0.35} floatIntensity={0.25}>
        <mesh position={[-3.2, 1.6, -1.2]}>
          <torusKnotGeometry args={[0.62, 0.16, 120, 18]} />
          <meshStandardMaterial color="#22d3ee" metalness={0.44} roughness={0.34} />
        </mesh>
      </Float>

      <Float speed={0.6} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh position={[3.4, -1.4, -1]}>
          <octahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.4} roughness={0.38} />
        </mesh>
      </Float>

      <mesh rotation={[Math.PI / 2.4, 0.15, 0]} position={[0, 0, -1.8]}>
        <torusGeometry args={[2.8, 0.03, 16, 160]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.18} />
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
    ref.current.rotation.y = t * 0.006;
    ref.current.rotation.x = Math.sin(t * 0.08) * 0.015;
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled>
      <PointMaterial transparent size={0.026} sizeAttenuation depthWrite={false} color="#7dd3fc" opacity={0.55} />
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
