document.addEventListener("DOMContentLoaded", () => {
  // --- Scene Setup ---
  // Create the scene where all objects will be added.
  const scene = new THREE.Scene();

  // Create a perspective camera with a 75° field of view.
  // The aspect ratio is based on the viewport dimensions.
  // Near and far clipping planes are set to 0.1 and 1000 respectively.
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Create a WebGL renderer with an alpha channel (transparency).
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Position the renderer's canvas to cover the whole viewport.
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "4"; // Adjust z-index for stacking order

  // Append the renderer's canvas element to the body.
  document.body.appendChild(renderer.domElement);

  // --- Custom Texture for Particles ---
  // This function creates a canvas texture that represents a thin vertical strand.
  function createStrandTexture() {
    const size = 64; // The canvas size (adjust for resolution of the texture)
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    // Clear the canvas
    context.clearRect(0, 0, size, size);

    // Draw a thin vertical line (the "strand")
    context.strokeStyle = "#014aad"; // Color of the strand
    context.lineWidth = 2; // Thickness of the strand (adjust as needed)
    context.beginPath();
    context.moveTo(size / 2, 0); // Start at the top center of the canvas
    context.lineTo(size / 2, size); // Draw a line to the bottom center
    context.stroke();

    // Return a texture based on the canvas
    return new THREE.CanvasTexture(canvas);
  }

  // Create the strand texture to be used in the particle material.
  const strandTexture = createStrandTexture();

  // --- Particle System Setup ---
  // Set the number of particles. Increase this number for higher density.
  const particlesCount = 500; 

  // Create a BufferGeometry to efficiently store the particle positions.
  const geometry = new THREE.BufferGeometry();

  // Create a Float32Array to hold position data for each particle.
  // Each particle has three values (x, y, z). So, total values = particlesCount * 3.
  const positions = new Float32Array(particlesCount * 3);

  // Loop to assign a random position to each particle.
  for (let i = 0; i < particlesCount * 3; i++) {
    // Multiply by 50 to define the spatial "spread" of the particles.
    // Adjust the multiplier to increase or decrease the overall area in which particles appear.
    positions[i] = (Math.random() - 0.5) * 100;
  }

  // Set the positions attribute of the geometry.
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Create a PointsMaterial to render the particles.
  // 'size' controls the size of each particle. Adjust for finer or larger strands.
  const material = new THREE.PointsMaterial({
    color: 0xffffff,      // Base color (will be multiplied by texture color)
    size: 1,              // Particle size (tweak to get the right thickness)
    map: strandTexture,   // Use the custom strand texture we created
    transparent: true,    // Allow transparency so edges of the strand can be soft
    depthWrite: false,    // Prevents particles from writing to the depth buffer
  });

  // Create the particle system as a Points object.
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // --- Camera Positioning ---
  // Move the camera back so that we can view the particle field.
  camera.position.z = 30; // Increase this value to see more of the scene

  // --- Animation Loop ---
  function animate() {
    requestAnimationFrame(animate);
    // Optional rotation for visual effect.
    // Adjust the rotation speed for slower or faster movement.
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  // --- Responsive Resize Handler ---
  // Adjust camera and renderer when the window size changes.
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
