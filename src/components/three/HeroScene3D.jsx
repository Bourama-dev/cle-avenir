import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Trail, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ── Particules orbitales ──────────────────────────────────────────────────────
function OrbitingParticles({ count = 120, radius = 2.8 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + (Math.random() - 0.5) * 1.2;
      return {
        theta,
        phi,
        r,
        speed: 0.002 + Math.random() * 0.006,
        offset: Math.random() * Math.PI * 2,
        scale: 0.015 + Math.random() * 0.03,
      };
    });
  }, [count, radius]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const angle = p.offset + t * p.speed * 60;
      const x = p.r * Math.sin(p.phi) * Math.cos(angle);
      const y = p.r * Math.cos(p.phi) * 0.6;
      const z = p.r * Math.sin(p.phi) * Math.sin(angle);
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.scale + Math.sin(t * 2 + p.offset) * 0.008);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#e11d48" emissive="#e11d48" emissiveIntensity={0.4} roughness={0.2} metalness={0.8} />
    </instancedMesh>
  );
}

// ── Anneau de données ─────────────────────────────────────────────────────────
function DataRing({ radius = 2.2, color = '#06b6d4', speed = 0.4, tilt = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * speed;
    ref.current.rotation.x = tilt;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.1} metalness={1} />
    </mesh>
  );
}

// ── Nœuds flottants (compétences) ────────────────────────────────────────────
function SkillNode({ position, color, label }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.12;
  });
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0} metalness={1} />
      </mesh>
    </Float>
  );
}

// ── Sphère centrale pulsante ──────────────────────────────────────────────────
function CoreSphere() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.distort = 0.3 + Math.sin(clock.getElapsedTime() * 0.8) * 0.12;
  });
  return (
    <Sphere ref={ref} args={[1.3, 64, 64]}>
      <MeshDistortMaterial
        color="#7c3aed"
        emissive="#4f1d96"
        emissiveIntensity={0.3}
        distort={0.35}
        speed={2.5}
        roughness={0}
        metalness={0.6}
      />
    </Sphere>
  );
}

// ── Nœuds sur orbe ───────────────────────────────────────────────────────────
const SKILL_NODES = [
  { position: [2.5, 0.8, 0.5], color: '#f59e0b' },
  { position: [-2.3, -0.5, 0.8], color: '#10b981' },
  { position: [0.5, 2.4, -0.8], color: '#3b82f6' },
  { position: [-0.8, -2.2, 0.5], color: '#ec4899' },
  { position: [2.0, -1.5, -0.5], color: '#8b5cf6' },
  { position: [-1.8, 1.2, -1.2], color: '#06b6d4' },
];

// ── Caméra réagit à la souris ─────────────────────────────────────────────────
function CameraRig() {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const el = gl.domElement;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [gl]);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Scène principale ──────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#e11d48" />
      <pointLight position={[-5, -5, 3]} intensity={1} color="#06b6d4" />
      <pointLight position={[0, 5, -5]} intensity={0.8} color="#7c3aed" />

      <CameraRig />

      {/* Sphère centrale */}
      <CoreSphere />

      {/* Anneaux orbitaux */}
      <DataRing radius={2.1} color="#e11d48" speed={0.3} tilt={0.3} />
      <DataRing radius={2.5} color="#06b6d4" speed={-0.2} tilt={-0.5} />
      <DataRing radius={2.8} color="#7c3aed" speed={0.15} tilt={1.1} />

      {/* Nuage de particules */}
      <OrbitingParticles count={150} radius={3} />

      {/* Nœuds compétences */}
      {SKILL_NODES.map((node, i) => (
        <SkillNode key={i} {...node} />
      ))}

      {/* Étoiles de fond */}
      <Stars radius={20} depth={10} count={500} factor={2} saturation={0} fade speed={0.5} />
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function HeroScene3D() {
  return (
    <div className="w-full h-full" style={{ minHeight: '500px' }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
