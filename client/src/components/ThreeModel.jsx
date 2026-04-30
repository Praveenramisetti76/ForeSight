import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, model;
    let mouseX = 0, mouseY = 0;

    // Initialize Three.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 1.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const subtleLight = new THREE.PointLight(0x1e293b, 3);
    subtleLight.position.set(-5, -5, 5);
    scene.add(subtleLight);

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
      requestAnimationFrame(animate);
      if (model) {
        model.rotation.x += (mouseY * 0.5 - model.rotation.x) * 0.05;
        model.rotation.y += (mouseX * 0.5 - model.rotation.y) * 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    const onResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />;
};

export default ThreeModel;
