document.addEventListener("DOMContentLoaded", () => {
  // Basic scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Ensure the canvas is visible by adding it after the DOM is ready
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "4"; // for testing

  document.body.appendChild(renderer.domElement);

  // Create a custom texture that looks like a fine strand
  function createStrandTexture() {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    // Clear the canvas
    context.clearRect(0, 0, size, size);

    // Draw a thin vertical line in the center
    context.strokeStyle = "white"; // color for the strand
    context.lineWidth = 2; // adjust for thickness
    context.beginPath();
    context.moveTo(size / 2, 0);
    context.lineTo(size / 2, size);
    context.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  const strandTexture = createStrandTexture();

  // Create particles using a custom texture
  const particlesCount = 500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1, // adjust size as needed
    map: strandTexture,
    transparent: true,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Position the camera
  camera.position.z = 30;

  function animate() {
    requestAnimationFrame(animate);
    // Optional: rotate particles slowly for effect
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
 
//   // Create particles
//   const particlesCount = 500;
//   const geometry = new THREE.BufferGeometry();
//   const positions = new Float32Array(particlesCount * 3);
//   for (let i = 0; i < particlesCount * 3; i++) {
//     positions[i] = (Math.random() - 0.5) * 50;
//   }
//   geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//   const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
//   const particles = new THREE.Points(geometry, material);
//   scene.add(particles);

//   // Set camera position
//   camera.position.z = 30;

//   // Animate
//   function animate() {
//     requestAnimationFrame(animate);
//     particles.rotation.y += 0.001;
//     renderer.render(scene, camera);
//   }
//   animate();

//   // Responsive: update renderer and camera on window resize
//   window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   });
// });
