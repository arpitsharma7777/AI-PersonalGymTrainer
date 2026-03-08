import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Types ─────────────────────────────────────────────────────────────────────
type Vec3 = [number, number, number];

// ── Pose data ─────────────────────────────────────────────────────────────────
const STANDING: Vec3[] = [
  [0,      1.75,  0   ],  // 0  head
  [-0.28,  1.45,  0   ],  // 1  l-shoulder
  [ 0.28,  1.45,  0   ],  // 2  r-shoulder
  [-0.46,  1.05,  0   ],  // 3  l-elbow
  [ 0.46,  1.05,  0   ],  // 4  r-elbow
  [-0.50,  0.65,  0   ],  // 5  l-wrist
  [ 0.50,  0.65,  0   ],  // 6  r-wrist
  [-0.18,  0.90,  0   ],  // 7  l-hip
  [ 0.18,  0.90,  0   ],  // 8  r-hip
  [-0.20,  0.48,  0   ],  // 9  l-knee
  [ 0.20,  0.48,  0   ],  // 10 r-knee
  [-0.20,  0,     0   ],  // 11 l-ankle
  [ 0.20,  0,     0   ],  // 12 r-ankle
];

const SQUAT: Vec3[] = [
  [ 0,     1.22, -0.08],
  [-0.30,  0.98, -0.04],
  [ 0.30,  0.98, -0.04],
  [-0.58,  0.78,  0.18],
  [ 0.58,  0.78,  0.18],
  [-0.65,  0.62,  0.35],
  [ 0.65,  0.62,  0.35],
  [-0.22,  0.52, -0.04],
  [ 0.22,  0.52, -0.04],
  [-0.42,  0.18,  0.28],
  [ 0.42,  0.18,  0.28],
  [-0.22,  0,     0   ],
  [ 0.22,  0,     0   ],
];

const BONES: [number, number][] = [
  [0,1],[0,2],[1,2],
  [1,3],[3,5],[2,4],[4,6],
  [1,7],[2,8],[7,8],
  [7,9],[9,11],[8,10],[10,12],
];

function lerpV(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonBody() {
  const groupRef = useRef<THREE.Group>(null);

  const greenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#17E777",
        emissive: "#17E777",
        emissiveIntensity: 4,
        roughness: 0.1,
      }),
    []
  );

  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#17E777" }),
    []
  );

  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;

    STANDING.forEach((pos, i) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(i === 0 ? 0.07 : 0.042, 16, 16),
        greenMat
      );
      mesh.position.set(...pos);
      mesh.userData.kind = "joint";
      mesh.userData.idx = i;
      g.add(mesh);
    });

    BONES.forEach(([a, b]) => {
      const arr = new Float32Array([...STANDING[a], ...STANDING[b]]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      const line = new THREE.Line(geo, lineMat);
      line.userData.kind = "bone";
      line.userData.a = a;
      line.userData.b = b;
      g.add(line);
    });

    return () => {
      while (g.children.length) g.remove(g.children[0]);
    };
  }, [greenMat, lineMat]);

  useFrame(({ clock }, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const t = (Math.sin(clock.elapsedTime * 0.65) + 1) / 2;
    const cur = STANDING.map((s, i) => lerpV(s, SQUAT[i], t));

    g.rotation.y += delta * 0.32;

    g.children.forEach((child) => {
      if (child.userData.kind === "joint") {
        const p = cur[child.userData.idx];
        child.position.set(p[0], p[1], p[2]);
      } else if (child.userData.kind === "bone") {
        const pa = cur[child.userData.a];
        const pb = cur[child.userData.b];
        const attr = (child as THREE.Line).geometry.attributes
          .position as THREE.BufferAttribute;
        attr.setXYZ(0, pa[0], pa[1], pa[2]);
        attr.setXYZ(1, pb[0], pb[1], pb[2]);
        attr.needsUpdate = true;
      }
    });
  });

  return <group ref={groupRef} position={[0, -0.88, 0]} />;
}

// ── Floating particles ────────────────────────────────────────────────────────
function Particles({ count = 80 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 5,
        y: Math.random() * 3.5 - 0.5,
        z: (Math.random() - 0.5) * 3.5,
        speed: Math.random() * 0.4 + 0.15,
        amp: Math.random() * 0.22 + 0.05,
        phase: Math.random() * Math.PI * 2,
      })),
    [count]
  );

  const geo = useMemo(() => new THREE.SphereGeometry(0.013, 6, 6), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#17E777",
        emissive: "#17E777",
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.6,
      }),
    []
  );

  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    data.forEach((p) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.x, p.y, p.z);
      mesh.userData = { ...p };
      g.add(mesh);
    });
    return () => { while (g.children.length) g.remove(g.children[0]); };
  }, [data, geo, mat]);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.children.forEach((child) => {
      const p = child.userData;
      child.position.y = p.y + Math.sin(t * p.speed + p.phase) * p.amp;
    });
  });

  return <group ref={groupRef} />;
}

// ── Ground ring ───────────────────────────────────────────────────────────────
function GroundRing() {
  const ref = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => new THREE.RingGeometry(0.4, 0.72, 64), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#17E777",
        emissive: "#17E777",
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.opacity = 0.14 + Math.sin(clock.elapsedTime * 1.4) * 0.08;
  });

  return (
    <mesh ref={ref} geometry={geo} material={mat}
      rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.88, 0]} />
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight color="#17E777" intensity={8}  position={[0,  2,   1.5]} />
      <pointLight color="#17E777" intensity={4}  position={[0,  0,   2  ]} />
      <pointLight color="#08d9f0" intensity={2}  position={[-2, 1,  -1  ]} />
      <pointLight color="#17E777" intensity={3}  position={[0,  1.5, 0.5]} />
      <SkeletonBody />
      <Particles />
      <GroundRing />
    </>
  );
}

// ── Canvas ────────────────────────────────────────────────────────────────────
export default function GymModel3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.88, 3.2], fov: 46 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
