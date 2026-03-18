import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Torus, Icosahedron, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null!);
  
  const points = useMemo(() => {
    const p = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const r = 15 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, []);

  useFrame((state) => {
    ref.current.rotation.x -= 0.0002;
    ref.current.rotation.y -= 0.0003;
    
    const targetX = (state.pointer.x * 0.5);
    const targetY = (state.pointer.y * 0.5);
    
    ref.current.position.x += (targetX - ref.current.position.x) * 0.05;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.05;
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#05D9E8"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

function CinematicRings() {
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);
  const ring3 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ring1.current.rotation.x = t * 0.1;
    ring1.current.rotation.y = t * 0.15;
    
    ring2.current.rotation.x = t * -0.12;
    ring2.current.rotation.y = t * 0.1;

    ring3.current.rotation.x = t * 0.08;
    ring3.current.rotation.z = t * -0.15;
  });

  return (
    <>
      <Torus ref={ring1} args={[4, 0.02, 16, 100]} position={[0, 0, -2]}>
        <meshBasicMaterial color="#B026FF" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </Torus>
      <Torus ref={ring2} args={[5, 0.015, 16, 100]} position={[0, 0, -3]}>
        <meshBasicMaterial color="#05D9E8" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </Torus>
      <Torus ref={ring3} args={[6, 0.01, 16, 100]} position={[0, 0, -4]}>
        <meshBasicMaterial color="#FF2A6D" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </Torus>
    </>
  );
}

function FloatingGeometry() {
  return (
    <>
      <Float speed={3} rotationIntensity={3} floatIntensity={4} position={[-4, 2, -5]}>
        <Icosahedron args={[1.5, 0]}>
          <meshBasicMaterial color="#1DA1F2" wireframe transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </Icosahedron>
      </Float>
      <Float speed={2.5} rotationIntensity={2} floatIntensity={3} position={[4, -2, -6]}>
        <Icosahedron args={[2, 0]}>
          <meshBasicMaterial color="#B026FF" wireframe transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </Icosahedron>
      </Float>
    </>
  );
}

export const ThreeBackground = () => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 2]}>
      <color attach="background" args={['#010101']} />
      <fog attach="fog" args={['#010101', 5, 20]} />
      <ambientLight intensity={0.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ParticleSwarm />
      <CinematicRings />
      <FloatingGeometry />
      
      {/* Soft Glow Lights */}
      <pointLight position={[10, 10, 10]} color="#05D9E8" intensity={2} distance={20} />
      <pointLight position={[-10, -10, -10]} color="#B026FF" intensity={2} distance={20} />
      <pointLight position={[0, 0, 5]} color="#FF2A6D" intensity={1} distance={10} />
    </Canvas>
  );
};
