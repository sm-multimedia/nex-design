import { Float, OrbitControls, useTexture } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { SRGBColorSpace } from 'three';

const designs = [
  { image: '/images/customized-shirt.png', position: [-4.7, 0.05, -0.8], rotation: [0.02, 0.22, 0.02], scale: 0.82 },
  { image: '/images/tshirt3.png', position: [-2.35, -0.12, 0.1], rotation: [-0.04, 0.12, -0.02], scale: 0.96 },
  { image: '/images/shirtdesign.png', position: [0, 0.12, 0.55], rotation: [0, 0, 0], scale: 1.08 },
  { image: '/images/niceshirt.png', position: [2.35, -0.1, 0.1], rotation: [0.04, -0.12, 0.02], scale: 0.96 },
  { image: '/images/greenpot.png', position: [4.7, 0.06, -0.8], rotation: [-0.02, -0.22, -0.02], scale: 0.82 },
];

const DesignCard = ({ design }) => {
  const texture = useTexture(design.image);
  texture.colorSpace = SRGBColorSpace;

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.14}>
      <group
        position={design.position}
        rotation={design.rotation}
        scale={design.scale}
      >
        <mesh position={[0, 0, -0.035]}>
          <planeGeometry args={[2.48, 1.16]} />
          <meshStandardMaterial color="#c8c4bd" roughness={0.38} metalness={0.28} />
        </mesh>
        <mesh>
          <planeGeometry args={[2.42, 1.1]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
};

const DesignGalleryScene = () => (
  <Canvas
    camera={{ position: [0, 0, 10.5], fov: 43 }}
    dpr={[1, 1.5]}
    gl={{ antialias: true, alpha: true }}
  >
    <ambientLight intensity={1.6} />
    <directionalLight position={[2, 5, 8]} intensity={2.2} />
    <pointLight position={[-5, 1, 3]} color="#9d8df5" intensity={22} />
    <pointLight position={[5, -1, 3]} color="#65d6c2" intensity={18} />
    {designs.map((design) => (
      <DesignCard key={design.image} design={design} />
    ))}
    <OrbitControls
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 2.35}
      maxPolarAngle={Math.PI / 1.65}
      minAzimuthAngle={-0.35}
      maxAzimuthAngle={0.35}
    />
  </Canvas>
);

export default DesignGalleryScene;
