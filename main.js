import "./style.css";
import { Scene, OrthographicCamera, WebGLRenderer, Color, Vector2 } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { createNoise2D } from "simplex-noise";

const scene = new Scene();
const res = 800;
const camera = new OrthographicCamera(-res * 0.5, res * 0.5, res * 0.5, -res * 0.5, 0, 1000);
camera.position.z = 0;

const noise2D = createNoise2D();

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new Color("rgb(34,30,27)");

let lines = [];
let myLine;
let geometry;

function createLines(time = 0) {
  // Remove old lines and dispose of their geometries
  lines.forEach(({ line, geo }) => {
    scene.remove(line);
    geo.dispose();
  });
  lines = [];
  for (let r = -20; r < 20; r++) {
    let vertices = [];
  for (let i = 0; i < 100; i++) {
    let height = 0;
    const frequency = 0.089;
    height += noise2D(i * frequency * 1, time * r / 10) * 2.0;

    vertices.push(
      -400 + 660 * 1.23 * (i / 100),
      height * 20 + r * time * 2 ,
      0,
    );
  }

  geometry = new LineGeometry();
  geometry.setPositions(vertices);

  myLine = new Line2(geometry, material);
  myLine.computeLineDistances();
  scene.add(myLine);

  lines.push({ line: myLine, geo: geometry });
}
}

// Initialize your material and lines
const material = new LineMaterial({
  color: "rgb(241, 231, 222)",
  linewidth: 1.2,
  resolution: new Vector2(res, res),
});
createLines();

let time = 0;
(function animate() {
  requestAnimationFrame(animate);

  time += 0.002; // Increase time to animate noise
  createLines(time);

  renderer.render(scene, camera);
})();