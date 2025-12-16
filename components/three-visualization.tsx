'use client';

import { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';

export const ThreeVisualization = memo(function ThreeVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Defer rendering slightly to prioritize initial page load
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFAFAFA);
    scene.fog = new THREE.Fog(0xFAFAFA, 20, 50);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const aspect = width / height;
    const d = 20;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);

    camera.position.set(20, 20, 20);
    camera.lookAt(scene.position);

    // Optimize renderer settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio
    renderer.shadowMap.enabled = false; // Disable shadows for performance
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Simplified lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(20, 40, 10);
    scene.add(dirLight);

    // Reduce grid size for better performance
    const gridSize = 16; // Reduced from 24
    const count = gridSize * gridSize;
    const spacing = 1.2;
    const boxSize = 0.9;

    const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);
    geometry.translate(0, 0.5, 0);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true // Better performance
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    scene.add(mesh);

    const dummy = new THREE.Object3D();
    
    // Pre-calculate positions once
    const positions: { x: number; z: number }[] = [];
    const offset = (gridSize * spacing) / 2;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        positions.push({
          x: i * spacing - offset,
          z: j * spacing - offset
        });
      }
    }

    let time = 0;
    let lastFrameTime = performance.now();
    const targetFPS = 30; // Cap at 30fps for better performance
    const frameInterval = 1000 / targetFPS;

    // Optimized noise function
    const noise = (x: number, z: number, t: number): number => {
      return Math.sin(x * 0.3 + t) * Math.cos(z * 0.3 + t * 0.5) * 2 + Math.sin(x * 0.7 + t * 2) * 0.5;
    };

    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Throttle to target FPS
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;
      
      lastFrameTime = currentTime - (elapsed % frameInterval);
      time += 0.015;

      // Batch matrix updates
      for (let i = 0; i < count; i++) {
        const pos = positions[i];
        const h = Math.max(0.5, 3 + noise(pos.x, pos.z, time));

        dummy.position.set(pos.x, 0, pos.z);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      const newAspect = newWidth / newHeight;

      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Cancel animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Proper cleanup
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      mesh.dispose();
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="w-full h-full bg-off-white relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-off-white">
          <div className="w-8 h-8 border-2 border-signal-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-20 text-right pointer-events-none">
        <div className="font-mono text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mb-1">Live Simulation</div>
        <div className="font-display text-sm sm:text-lg font-bold">Liquidity Depth Map</div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-20 pointer-events-none max-w-xs">
        <p className="font-mono text-[9px] sm:text-[10px] text-gray-400 leading-tight">
          VISUALIZATION OF PROPRIETARY TRADING ALGORITHMS ANALYZING VOLATILITY CLUSTERS ACROSS GLOBAL MARKETS.
        </p>
      </div>
    </div>
  );
});
