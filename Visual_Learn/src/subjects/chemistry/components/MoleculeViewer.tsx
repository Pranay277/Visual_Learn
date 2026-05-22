import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MoleculeData } from '../data/molecules';

const CPK_COLORS: Record<string, string> = {
  H: '#FFFFFF',
  C: '#404040',
  N: '#3050F8',
  O: '#FF0D0D',
  F: '#90E050',
  Cl: '#1FF01F',
  Br: '#A62929',
  I: '#940094',
  S: '#FFFF30',
  P: '#FF8000',
};

const VDW_RADII: Record<string, number> = {
  H: 0.25,
  C: 0.4,
  N: 0.35,
  O: 0.35,
  F: 0.35,
  Cl: 0.45,
  Br: 0.5,
  I: 0.55,
  S: 0.45,
  P: 0.45,
};

interface MoleculeViewerProps {
  molecule: MoleculeData;
  selectedAtom: string | null;
  onAtomClick: (atomId: string, atomLabel: string, elementName: string) => void;
}

const MoleculeViewer = ({ molecule, selectedAtom, onAtomClick }: MoleculeViewerProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Rotation animation
  useFrame(() => {
    if (groupRef.current && selectedAtom === null) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  // Calculate geometry
  const { centeredAtoms, bonds } = useMemo(() => {
    if (!molecule || molecule.atoms.length === 0) return { centeredAtoms: [], bonds: [] };

    // Calculate centroid
    let sumX = 0, sumY = 0, sumZ = 0;
    molecule.atoms.forEach(a => {
      sumX += a.position[0];
      sumY += a.position[1];
      sumZ += a.position[2];
    });
    
    const cx = sumX / molecule.atoms.length;
    const cy = sumY / molecule.atoms.length;
    const cz = sumZ / molecule.atoms.length;

    // Center atoms around origin
    const centeredAtoms = molecule.atoms.map(a => ({
      ...a,
      centeredPos: new THREE.Vector3(a.position[0] - cx, a.position[1] - cy, a.position[2] - cz)
    }));

    // Process bonds for 3D cylinders
    const bondsData = molecule.bonds.map(b => {
      const source = centeredAtoms.find(a => a.id === b.source);
      const target = centeredAtoms.find(a => a.id === b.target);
      if (!source || !target) return null;

      const p1 = source.centeredPos;
      const p2 = target.centeredPos;
      
      const distance = p1.distanceTo(p2);
      const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      
      // Calculate rotation quaternion to orient the cylinder between p1 and p2
      const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

      return {
        ...b,
        midpoint,
        quaternion,
        distance,
        direction
      };
    }).filter(Boolean) as any[];

    return { centeredAtoms, bonds: bondsData };
  }, [molecule]);

  return (
    <group ref={groupRef}>
      {/* Atoms */}
      {centeredAtoms.map(atom => {
        const isSelected = selectedAtom === atom.id;
        const color = CPK_COLORS[atom.element] || '#FF69B4';
        const baseRadius = VDW_RADII[atom.element] || 0.35;
        const scale = isSelected ? 1.3 : 1.0;
        const showLabel = isSelected || centeredAtoms.length < 6;

        return (
          <mesh
            key={atom.id}
            position={atom.centeredPos}
            scale={[scale, scale, scale]}
            onClick={(e) => {
              e.stopPropagation();
              onAtomClick(atom.id, atom.label, atom.element);
            }}
            castShadow
          >
            <sphereGeometry args={[baseRadius, 32, 32]} />
            <meshStandardMaterial
              color={color}
              emissive="#ffffff"
              emissiveIntensity={isSelected ? 0.4 : 0}
              roughness={0.2}
              metalness={0.1}
            />
            {showLabel && (
              <Html position={[0, baseRadius + 0.15, 0]} center zIndexRange={[100, 0]}>
                <div className="bg-black/90 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm border border-white/20 shadow-xl pointer-events-none whitespace-nowrap">
                  {atom.element}
                </div>
              </Html>
            )}
          </mesh>
        );
      })}

      {/* Bonds */}
      {bonds.map((bond, idx) => {
        // Single bond
        if (bond.type === 1) {
          return (
            <mesh
              key={`bond-${idx}`}
              position={bond.midpoint}
              quaternion={bond.quaternion}
              castShadow
            >
              <cylinderGeometry args={[0.08, 0.08, bond.distance, 16]} />
              <meshStandardMaterial color="#888888" roughness={0.4} />
            </mesh>
          );
        } 
        
        // Double bond
        if (bond.type === 2) {
          const up = new THREE.Vector3(0, 1, 0);
          // If direction is too close to 'up', pick a different perpendicular vector
          if (Math.abs(bond.direction.dot(up)) > 0.99) up.set(1, 0, 0);
          
          // Compute perpendicular offset
          const perp = new THREE.Vector3().crossVectors(bond.direction, up).normalize().multiplyScalar(0.12);
          
          const mid1 = new THREE.Vector3().copy(bond.midpoint).add(perp);
          const mid2 = new THREE.Vector3().copy(bond.midpoint).sub(perp);

          return (
            <group key={`bond-${idx}`}>
              <mesh position={mid1} quaternion={bond.quaternion} castShadow>
                <cylinderGeometry args={[0.08, 0.08, bond.distance, 16]} />
                <meshStandardMaterial color="#888888" roughness={0.4} />
              </mesh>
              <mesh position={mid2} quaternion={bond.quaternion} castShadow>
                <cylinderGeometry args={[0.08, 0.08, bond.distance, 16]} />
                <meshStandardMaterial color="#888888" roughness={0.4} />
              </mesh>
            </group>
          );
        }
        
        return null;
      })}
    </group>
  );
};

export default MoleculeViewer;
