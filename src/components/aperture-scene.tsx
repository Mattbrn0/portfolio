"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExtrudeGeometry, Matrix4, Quaternion, Shape, Vector3, type Group, type Mesh } from "three";
import { logoGeometry } from "@/lib/logo";

const { count, inner, outer, height, taper, twist, tilt, roll } = logoGeometry;

/** Repère d'une lame : x radial, y largeur (inclinée de `bladeTwist`), z normale. */
function bladeQuaternion(index: number, bladeTwist: number, target: Quaternion) {
  const angle = (index / count) * Math.PI * 2;
  const x = new Vector3(Math.cos(angle), Math.sin(angle), 0);
  const y = new Vector3(
    -Math.sin(angle) * Math.sin(bladeTwist),
    Math.cos(angle) * Math.sin(bladeTwist),
    Math.cos(bladeTwist),
  );
  const z = new Vector3().crossVectors(x, y).normalize();
  return target.setFromRotationMatrix(new Matrix4().makeBasis(x, y, z));
}

function bladeGeometry() {
  const half = height / 2;
  const shape = new Shape();
  shape.moveTo(inner, -half * taper);
  shape.lineTo(outer, -half);
  shape.lineTo(outer, half);
  shape.lineTo(inner, half * taper);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 3,
  });
  geometry.translate(0, 0, -0.008);
  return geometry;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

function seeded(index: number) {
  const x = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function Aperture({
  color,
  progress,
  offsetX,
}: {
  color: string;
  progress: MotionValue<number>;
  offsetX: number;
}) {
  const holder = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const blades = useRef<Array<Mesh | null>>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const start = useRef<number | null>(null);
  const geometry = useMemo(() => bladeGeometry(), []);

  // Chaque lame part d'une position dispersée et vient se ranger dans l'anneau.
  const scatter = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        const distance = 2.2 + seeded(index) * 2.4;
        const offset = new Vector3(
          Math.cos(angle) * distance,
          Math.sin(angle) * distance,
          1.5 + seeded(index + 40) * 2.5,
        );
        const spinQ = new Quaternion().setFromAxisAngle(
          new Vector3(seeded(index + 7), seeded(index + 11), seeded(index + 19)).normalize(),
          Math.PI * (1 + seeded(index + 3)),
        );
        return { offset, spinQ, delay: seeded(index + 23) * 0.5 };
      }),
    [],
  );

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const target = useMemo(() => new Quaternion(), []);
  const current = useMemo(() => new Quaternion(), []);

  useFrame((state, delta) => {
    const ring = spin.current;
    const tilted = holder.current;
    if (!ring || !tilted) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - start.current;

    const p = progress.get();
    const open = smooth(0.08, 0.92, p);

    // Le diaphragme s'ouvre : les lames pivotent sur leur axe et l'anneau grandit jusqu'à
    // ce que son trou remplisse l'écran. On passe à travers le logo pour entrer dans le travail.
    const bladeTwist = twist + open * 1.05;
    const scale = 1 + Math.pow(open, 2.2) * 9;
    ring.scale.setScalar(scale);
    ring.rotation.z += delta * (0.16 + open * 1.4);

    const facing = 1 - open;
    tilted.rotation.x +=
      (tilt * facing + pointer.current.y * 0.18 * facing - tilted.rotation.x) * 0.06;
    tilted.rotation.y += (pointer.current.x * 0.28 * facing - tilted.rotation.y) * 0.06;
    tilted.rotation.z = roll * facing;
    // Sur grand écran l'anneau se tient à droite du titre, puis glisse au centre en s'ouvrant.
    tilted.position.x = offsetX * facing;

    blades.current.forEach((mesh, index) => {
      const from = scatter[index];
      if (!mesh || !from) return;
      const t = easeOutExpo(Math.min(1, Math.max(0, (elapsed - from.delay) / 1.6)));
      bladeQuaternion(index, bladeTwist, target);
      current.copy(from.spinQ).multiply(target).slerp(target, t);
      mesh.quaternion.copy(current);
      mesh.position.copy(from.offset).multiplyScalar(1 - t);
    });
  });

  return (
    <group ref={holder} rotation={[tilt, 0, roll]}>
      <group ref={spin}>
        {Array.from({ length: count }, (_, index) => (
          <mesh
            key={index}
            ref={(node) => {
              blades.current[index] = node;
            }}
            geometry={geometry}
          >
            <meshPhysicalMaterial
              color={color}
              metalness={0.92}
              roughness={0.22}
              clearcoat={1}
              clearcoatRoughness={0.15}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function ApertureScene({
  color,
  progress,
  offsetX = 0,
}: {
  color: string;
  progress: MotionValue<number>;
  offsetX?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(Boolean(entry?.isIntersecting)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        aria-hidden
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 4.4], fov: 34 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 3, 4]} intensity={1.4} />
        {/* Studio photo en nuances de gris, calculé localement : aucun fichier HDR à télécharger. */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={5} position={[0, 4, 2]} scale={[10, 1.2, 1]} />
          <Lightformer
            form="rect"
            intensity={2.5}
            position={[-5, 0, 1]}
            rotation-y={Math.PI / 2}
            scale={[8, 2, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2}
            position={[5, -1, 1]}
            rotation-y={-Math.PI / 2}
            scale={[8, 1, 1]}
          />
          <Lightformer form="ring" intensity={1.5} position={[0, 0, -6]} scale={6} />
        </Environment>
        <Aperture color={color} progress={progress} offsetX={offsetX} />
      </Canvas>
    </div>
  );
}
