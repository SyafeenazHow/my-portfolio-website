import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function FloatingPortrait({ url = "/portrait2.png" }) {
  const group = useRef();
  const material = useRef();
  const glowMat = useRef();

  const texture = useTexture(url);

  // Make sure transparency looks clean
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // smooth slow floating motion
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.6) * 0.18; // up/down
      group.current.rotation.y = Math.sin(t * 0.25) * 0.08; // subtle sway
      group.current.rotation.x = Math.sin(t * 0.2) * 0.03; // subtle tilt
    }

    // subtle “breathing” brightness (optional)
    if (material.current) {
      material.current.opacity = 0.92 + Math.sin(t * 0.35) * 0.03;
    }

    // subtle pulsing glow (optional)
    if (glowMat.current) {
      glowMat.current.opacity = 0.18 + Math.sin(t * 0.4) * 0.03;
    }
  });

  // Plane size: tweak to match your image proportions
  const width = 2.2;
  const height = 2.8;

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* OUTER GLOW (soft halo) */}
      <mesh position={[0, 0, -0.03]} scale={[1.14, 1.14, 1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.08}
          color="#7c5cff" // glow color
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* INNER GLOW (stronger) */}
      <mesh position={[0, 0, -0.02]} scale={[1.07, 1.07, 1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={glowMat}
          map={texture}
          transparent
          opacity={0.18}
          color="#7c5cff" // glow color
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* MAIN PORTRAIT */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          ref={material}
          map={texture}
          transparent
          alphaTest={0.02} // helps cut fringing
          depthWrite={false} // cleaner blending
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function BackgroundGlow() {
  // A simple large plane behind everything to give soft contrast
  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial color="#0b1020" />
    </mesh>
  );
}

export default function ThreeHero() {
  return (
    <div className="hero3d">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* optional: set true scene background color */}
      

        {/* lights */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 4]} intensity={1.0} />
        <directionalLight position={[-4, 1, 2]} intensity={0.6} />

        {/* background */}
        <BackgroundGlow />

        {/* your floating cutout with glow */}
        <FloatingPortrait url="/portrait2.png" />
      </Canvas>

      {/* optional overlay content */}
      <div className="heroOverlay">
        <div className="heroText">
          <h1>Syafeenaz How</h1>
          <p>Leadership • Developer • Sales</p>
        </div>
      </div>
    </div>
  );
}
