import { useEffect, useRef } from "react";
import * as THREE from "three";

const RotatingCube = ({ className }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617"); // slate-950

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    // Plateau « chip » principal
    const plateGeometry = new THREE.BoxGeometry(4, 0.18, 4);
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#020617"),
      metalness: 0.9,
      roughness: 0.15,
      emissive: new THREE.Color("#0f172a"),
      emissiveIntensity: 0.9,
    });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    scene.add(plate);

    // Noyau lumineux central
    const coreGeometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#e879f9"), // fuchsia-400
      metalness: 0.4,
      roughness: 0.05,
      emissive: new THREE.Color("#38bdf8"), // sky-400
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.y = 0.5;
    scene.add(core);

    // Anneau néon autour du noyau
    const ringGeometry = new THREE.TorusGeometry(2.4, 0.06, 24, 96);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#38bdf8"),
      emissive: new THREE.Color("#38bdf8"),
      emissiveIntensity: 2.2,
      metalness: 0.6,
      roughness: 0.2,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.1;
    ring.position.y = 0.35;
    scene.add(ring);

    // « Traces » de circuits autour du plateau
    const traceMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#22c55e"),
      emissive: new THREE.Color("#22c55e"),
      emissiveIntensity: 1.4,
      metalness: 0.6,
      roughness: 0.3,
    });

    const traces = [];
    const traceGeom = new THREE.BoxGeometry(0.9, 0.02, 0.04);
    for (let i = 0; i < 6; i++) {
      const t = new THREE.Mesh(traceGeom, traceMaterial);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 1.85;
      t.position.set(Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius);
      t.rotation.y = angle;
      scene.add(t);
      traces.push(t);
    }

    // Lumières cohérentes avec le reste du site
    const keyLight = new THREE.DirectionalLight("#e879f9", 1.25); // fuchsia-400
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#38bdf8", 1.0); // sky-400
    fillLight.position.set(-5, -3, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight("#22c55e", 1.4, 14); // emerald-500
    rimLight.position.set(0, 3.5, -5);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight("#ffffff", 0.25);
    scene.add(ambient);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Léger flottement vertical du noyau
      core.position.y = 0.45 + Math.sin(t * 1.2) * 0.08;

      // Rotation douce du noyau et de l’anneau
      core.rotation.x = Math.sin(t * 0.6) * 0.3;
      core.rotation.y += 0.02;
      ring.rotation.y += 0.018;

      // Pulsation discrète des « circuits »
      const pulse = 1.1 + Math.sin(t * 2.0) * 0.25;
      traces.forEach((trace, i) => {
        const localPulse = pulse + Math.sin(t * 1.5 + i) * 0.15;
        trace.scale.z = localPulse;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || width;
      const h = mount.clientHeight || height;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      plateGeometry.dispose();
      plateMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      traceGeom.dispose();
      traceMaterial.dispose();
      renderer.dispose();
      if (mount.contains(canvas)) {
        mount.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
    />
  );
};

export default RotatingCube;

