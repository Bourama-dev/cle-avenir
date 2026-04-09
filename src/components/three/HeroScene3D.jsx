import React, { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Text, OrbitControls, RoundedBox, Torus, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Target, Zap, Sparkles } from 'lucide-react';

// ─── Utilitaire couleur ───────────────────────────────────────────────────────
const color = (hex, emissive = false) => (
  <meshStandardMaterial
    color={hex}
    emissive={emissive ? hex : '#000000'}
    emissiveIntensity={emissive ? 0.25 : 0}
    roughness={0.3}
    metalness={0.1}
  />
);

// ─── Tête du personnage ───────────────────────────────────────────────────────
function Head({ bodyRef }) {
  const ref = useRef();
  const eyeL = useRef();
  const eyeR = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Légère rotation de la tête
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.3;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    // Clignotement des yeux
    const blink = Math.floor(t * 3) % 20 === 0 ? 0.05 : 1;
    eyeL.current.scale.y = blink;
    eyeR.current.scale.y = blink;
  });

  return (
    <group ref={ref} position={[0, 1.55, 0]}>
      {/* Visage */}
      <RoundedBox args={[0.62, 0.65, 0.58]} radius={0.12} smoothness={4}>
        {color('#FBBF80')}
      </RoundedBox>
      {/* Cheveux */}
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.36, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        {color('#3B2A1A')}
      </mesh>
      <mesh position={[-0.31, 0.1, -0.02]}>
        <boxGeometry args={[0.06, 0.38, 0.5]} />
        {color('#3B2A1A')}
      </mesh>
      <mesh position={[0.31, 0.1, -0.02]}>
        <boxGeometry args={[0.06, 0.38, 0.5]} />
        {color('#3B2A1A')}
      </mesh>
      {/* Yeux */}
      <group position={[-0.15, 0.02, 0.29]}>
        <mesh>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh ref={eyeL} position={[0, 0, 0.04]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </group>
      <group position={[0.15, 0.02, 0.29]}>
        <mesh>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh ref={eyeR} position={[0, 0, 0.04]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </group>
      {/* Sourire */}
      <mesh position={[0, -0.13, 0.29]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.09, 0.018, 8, 12, Math.PI]} />
        {color('#c0704a')}
      </mesh>
      {/* Oreilles */}
      <mesh position={[-0.34, 0, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        {color('#FBBF80')}
      </mesh>
      <mesh position={[0.34, 0, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        {color('#FBBF80')}
      </mesh>
    </group>
  );
}

// ─── Corps ────────────────────────────────────────────────────────────────────
function Body() {
  return (
    <group position={[0, 0.7, 0]}>
      {/* Torse — veste */}
      <RoundedBox args={[0.7, 0.85, 0.45]} radius={0.08} smoothness={4}>
        {color('#4F46E5')}
      </RoundedBox>
      {/* Col chemise */}
      <mesh position={[0, 0.34, 0.18]}>
        <boxGeometry args={[0.22, 0.18, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Cravate */}
      <mesh position={[0, 0.18, 0.23]}>
        <boxGeometry args={[0.07, 0.28, 0.04]} />
        <meshStandardMaterial color="#e11d48" />
      </mesh>
      {/* Épaules */}
      <mesh position={[-0.42, 0.3, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        {color('#4F46E5')}
      </mesh>
      <mesh position={[0.42, 0.3, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        {color('#4F46E5')}
      </mesh>
    </group>
  );
}

// ─── Bras animés ─────────────────────────────────────────────────────────────
function Arms() {
  const lRef = useRef();
  const rRef = useRef();
  const lForeRef = useRef();
  const rForeRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const swing = Math.sin(t * 1.2) * 0.18;
    lRef.current.rotation.x = swing;
    rRef.current.rotation.x = -swing;
    lForeRef.current.rotation.x = 0.2 + Math.abs(swing) * 0.3;
    rForeRef.current.rotation.x = 0.2 + Math.abs(swing) * 0.3;
  });

  return (
    <>
      {/* Bras gauche */}
      <group position={[-0.52, 0.9, 0]} ref={lRef}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.085, 0.3, 6, 8]} />
          {color('#4F46E5')}
        </mesh>
        <group position={[0, -0.42, 0]} ref={lForeRef}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.075, 0.28, 6, 8]} />
            {color('#FBBF80')}
          </mesh>
          {/* Main */}
          <mesh position={[0, -0.38, 0]}>
            <sphereGeometry args={[0.085, 8, 8]} />
            {color('#FBBF80')}
          </mesh>
        </group>
      </group>
      {/* Bras droit (tient un livre) */}
      <group position={[0.52, 0.9, 0]} ref={rRef}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.085, 0.3, 6, 8]} />
          {color('#4F46E5')}
        </mesh>
        <group position={[0, -0.42, 0]} ref={rForeRef}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.075, 0.28, 6, 8]} />
            {color('#FBBF80')}
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <sphereGeometry args={[0.085, 8, 8]} />
            {color('#FBBF80')}
          </mesh>
          {/* Livre tenu */}
          <mesh position={[0.15, -0.42, 0.05]} rotation={[0.2, -0.3, 0.1]}>
            <boxGeometry args={[0.24, 0.3, 0.05]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.6} />
          </mesh>
          <mesh position={[0.145, -0.42, 0.08]} rotation={[0.2, -0.3, 0.1]}>
            <boxGeometry args={[0.22, 0.28, 0.01]} />
            <meshStandardMaterial color="#fff7ed" />
          </mesh>
        </group>
      </group>
    </>
  );
}

// ─── Jambes ───────────────────────────────────────────────────────────────────
function Legs() {
  const lRef = useRef();
  const rRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const swing = Math.sin(t * 1.2) * 0.12;
    lRef.current.rotation.x = -swing;
    rRef.current.rotation.x = swing;
  });

  return (
    <>
      {/* Bassin */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.62, 0.22, 0.42]} />
        {color('#1e1b4b')}
      </mesh>
      {/* Jambe gauche */}
      <group position={[-0.19, 0.2, 0]} ref={lRef}>
        <mesh position={[0, -0.22, 0]}>
          <capsuleGeometry args={[0.1, 0.38, 6, 8]} />
          {color('#1e1b4b')}
        </mesh>
        <mesh position={[0, -0.52, 0]}>
          <capsuleGeometry args={[0.09, 0.32, 6, 8]} />
          {color('#334155')}
        </mesh>
        {/* Chaussure */}
        <mesh position={[0, -0.72, 0.06]}>
          <boxGeometry args={[0.18, 0.1, 0.28]} />
          {color('#1a1a2e')}
        </mesh>
      </group>
      {/* Jambe droite */}
      <group position={[0.19, 0.2, 0]} ref={rRef}>
        <mesh position={[0, -0.22, 0]}>
          <capsuleGeometry args={[0.1, 0.38, 6, 8]} />
          {color('#1e1b4b')}
        </mesh>
        <mesh position={[0, -0.52, 0]}>
          <capsuleGeometry args={[0.09, 0.32, 6, 8]} />
          {color('#334155')}
        </mesh>
        {/* Chaussure */}
        <mesh position={[0, -0.72, 0.06]}>
          <boxGeometry args={[0.18, 0.1, 0.28]} />
          {color('#1a1a2e')}
        </mesh>
      </group>
    </>
  );
}

// ─── Personnage complet avec animation de flottement ─────────────────────────
function Character() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.08;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      <Head />
      <Body />
      <Arms />
      <Legs />
    </group>
  );
}

// ─── Étoiles orbitales (récompenses) ─────────────────────────────────────────
function OrbitingStar({ radius, speed, offset, color: col, yOffset = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = yOffset + Math.sin(t * 2) * 0.15;
    ref.current.rotation.y = t * 2;
    ref.current.rotation.z = t;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.12, 0]} />
      <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.6} roughness={0} metalness={1} />
    </mesh>
  );
}

// ─── Bulle de compétence flottante ────────────────────────────────────────────
function SkillBubble({ position, label, color: col }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0] * 3) * 0.12;
  });
  return (
    <Float speed={1.5} floatIntensity={0.3}>
      <group ref={ref} position={position}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.3} transparent opacity={0.85} roughness={0.1} />
        </mesh>
        <Text
          position={[0, 0, 0.22]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

// ─── Diplôme / Chapeau de graduation ─────────────────────────────────────────
function GradCap({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.5;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.1) * 0.1;
  });
  return (
    <group ref={ref} position={position}>
      {/* Plateau */}
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[0.45, 0.04, 0.45]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.4} />
      </mesh>
      {/* Calotte */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.16, 8]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.4} />
      </mesh>
      {/* Pompon */}
      <mesh position={[0, 0.07, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#e11d48" emissive="#e11d48" emissiveIntensity={0.5} />
      </mesh>
      {/* Fil */}
      <mesh position={[0.1, 0.04, 0.1]}>
        <cylinderGeometry args={[0.004, 0.004, 0.14, 4]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

// ─── Sol stylisé ──────────────────────────────────────────────────────────────
function Ground() {
  return (
    <mesh position={[0, -1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[2.5, 64]} />
      <meshStandardMaterial color="#e0e7ff" transparent opacity={0.5} roughness={1} />
    </mesh>
  );
}

// ─── Anneau de sol lumineux ───────────────────────────────────────────────────
function GlowRing() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.2;
  });
  return (
    <mesh ref={ref} position={[0, -1.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.5, 0.04, 8, 80]} />
      <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={1} />
    </mesh>
  );
}

// ─── Caméra réactive souris ───────────────────────────────────────────────────
function CameraRig() {
  const mouse = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  React.useEffect(() => {
    const onMove = (e) => {
      const rect = document.body.getBoundingClientRect();
      mouse.current.x = ((e.clientX / window.innerWidth) - 0.5) * 2;
      mouse.current.y = -((e.clientY / window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ camera }) => {
    camera.position.x += (mouse.current.x * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.current.y * 0.6 + 1.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0.5, 0);
  });

  return null;
}

// ─── Particules de fond ───────────────────────────────────────────────────────
function BackgroundParticles({ count = 60 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 6 - 3,
      speed: 0.3 + Math.random() * 0.7,
      offset: Math.random() * Math.PI * 2,
      scale: 0.02 + Math.random() * 0.05,
    })), [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(p.x, p.y + Math.sin(t * p.speed + p.offset) * 0.3, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial color="#c4b5fd" transparent opacity={0.5} />
    </instancedMesh>
  );
}

// ─── Scène complète ───────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Lumières */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} color="#ffffff" castShadow />
      <pointLight position={[-3, 3, 2]} intensity={0.8} color="#7c3aed" />
      <pointLight position={[3, 0, -2]} intensity={0.6} color="#e11d48" />
      <pointLight position={[0, -1, 3]} intensity={0.4} color="#06b6d4" />

      <CameraRig />
      <BackgroundParticles count={50} />

      {/* Personnage central */}
      <Character />

      {/* Sol */}
      <Ground />
      <GlowRing />

      {/* Chapeau de diplôme qui orbite au-dessus */}
      <GradCap position={[1.6, 1.2, 0]} />

      {/* Étoiles de récompenses en orbite */}
      <OrbitingStar radius={1.8} speed={0.7} offset={0} color="#f59e0b" yOffset={0.5} />
      <OrbitingStar radius={2.1} speed={-0.5} offset={2} color="#10b981" yOffset={0.2} />
      <OrbitingStar radius={1.6} speed={0.9} offset={4} color="#3b82f6" yOffset={0.8} />
      <OrbitingStar radius={2.3} speed={-0.4} offset={1} color="#e11d48" yOffset={-0.2} />
      <OrbitingStar radius={1.9} speed={0.6} offset={3} color="#8b5cf6" yOffset={0.6} />

      {/* Bulles compétences */}
      <SkillBubble position={[-2.2, 0.8, 0.5]} label="RIASEC" color="#7c3aed" />
      <SkillBubble position={[2.3, 0.4, 0.3]} label="IA" color="#e11d48" />
      <SkillBubble position={[-2.0, -0.3, -0.5]} label="CV" color="#06b6d4" />

      {/* Étoiles de fond */}
      <Stars radius={15} depth={8} count={300} factor={1.5} saturation={0} fade speed={0.3} />
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function HeroScene3D() {
  return (
    <div className="w-full h-full relative" style={{ minHeight: '520px' }}>
      <Canvas
        camera={{ position: [0, 1.5, 5.5], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Labels UI par-dessus le canvas */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute left-0 top-1/4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-violet-100 z-20 max-w-[180px] pointer-events-none"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 bg-violet-100 rounded-lg text-violet-600"><Target size={16} /></div>
          <span className="font-bold text-slate-800 text-sm">Profil détecté</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-rose-500 w-[92%]" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 5, delay: 1 }}
        className="absolute right-0 bottom-1/3 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-cyan-100 z-20 pointer-events-none"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-100 rounded-lg text-cyan-600"><Zap size={16} /></div>
          <div>
            <div className="font-bold text-slate-800 text-sm">+250 XP</div>
            <div className="text-xs text-slate-500">Activité complétée</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
        className="absolute right-6 top-1/4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-amber-100 z-20 pointer-events-none"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500" />
          <span className="text-xs font-semibold text-slate-700">Niveau 3 atteint !</span>
        </div>
      </motion.div>
    </div>
  );
}
