// threeBackground.js

// Basic scene setup
const scene = new THREE.Scene();

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a renderer and set transparent background so your content shows
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Insert the renderer's canvas behind other page content
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "-1"; // ensures it's behind other elements
document.body.appendChild(renderer.domElement);

// Create particles
const particlesCount = 500;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 50;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Position the camera
camera.position.z = 30;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001; // slow rotation effect
  renderer.render(scene, camera);
}
animate();

// Responsive: update renderer and camera on window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
