import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeModel = () => {
  const mountRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let scene, camera, renderer, model, frameId;

    // Initialize Three.js
    scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x3b82f6, 20);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x60a5fa, 15);
    blueLight.position.set(-5, -5, 2);
    scene.add(blueLight);

    // Procedural wireframe geometry
    const geometry = new THREE.IcosahedronGeometry(2.5, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    model = new THREE.Mesh(geometry, material);
    scene.add(model);

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (model) {
        model.rotation.x += (mouse.current.y * 0.5 - model.rotation.x) * 0.05;
        model.rotation.y += (mouse.current.x * 0.5 - model.rotation.y) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    const onMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Clean up Three.js resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export default ThreeModel;

