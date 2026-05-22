import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function MoleculeModel({ moleculeData }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  const renderedBonds = useMemo(() => {
    return moleculeData.bonds.map((bond, index) => {
      const sourceAtom = moleculeData.atoms.find(a => a.id === bond.source);
      const targetAtom = moleculeData.atoms.find(a => a.id === bond.target);
      
      if (!sourceAtom || !targetAtom) return null;

      const p1 = new THREE.Vector3(...sourceAtom.position);
      const p2 = new THREE.Vector3(...targetAtom.position);
      const distance = p1.distanceTo(p2);
      const position = p1.clone().lerp(p2, 0.5);
      
      const orientation = new THREE.Matrix4();
      orientation.lookAt(p1, p2, new THREE.Vector3(0, 1, 0));
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientation);
      quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));

      return {
        key: `bond-${index}`,
        position: [position.x, position.y, position.z],
        quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
        length: distance
      };
    });
  }, [moleculeData]);

  return (
    <group ref={groupRef}>
      {/* Atoms */}
      {moleculeData.atoms.map((atom) => (
        <group key={atom.id} position={atom.position}>
          <Sphere args={[atom.size * 0.5, 32, 32]}>
            <meshPhysicalMaterial 
              color={atom.color} 
              metalness={0.2}
              roughness={0.1}
              clearcoat={0.8}
              clearcoatRoughness={0.2}
            />
          </Sphere>
        </group>
      ))}

      {/* Bonds */}
      {renderedBonds.map((bond) => (
        bond && (
          <mesh key={bond.key} position={bond.position} quaternion={bond.quaternion}>
            <cylinderGeometry args={[0.15, 0.15, bond.length, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.3} />
          </mesh>
        )
      ))}

      {/* HTML Annotations */}
      {moleculeData.annotations && moleculeData.annotations.map((ann, i) => (
        <Html key={i} position={ann.position} center>
          <div className="mol-annotation">
            {ann.text}
          </div>
        </Html>
      ))}

    </group>
  );
}
