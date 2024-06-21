import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styleUrls: ['./cajas.component.scss']
})
export class CajasComponent implements AfterViewInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('textInput', { static: true }) textInput!: ElementRef<HTMLTextAreaElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private model: THREE.Object3D | null = null;
  private textPlane: THREE.Mesh | null = null;
  private textMeshes: THREE.Mesh[] = [];
  private fontLoader = new FontLoader();
  private maxTextWidth = 8; // ancho del plano para texto
  private maxLines = 3; // numero maximo de lineas a ocupar
  private lineHeight = 1; // alto de las lineas
  private baseTextSize = 0.5; // Tamaño base del texto

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.loadModel();
    this.createTextPlane();
  }

  initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.rendererContainer.nativeElement.clientWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.rendererContainer.nativeElement.clientWidth, window.innerHeight);
    this.renderer.setClearColor(0xA3A3A3);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(25, 18, 18);
    this.camera.lookAt(this.scene.position);
    controls.update();

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.animate();
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  loadModel(): void {
    const gltfLoader = new GLTFLoader();
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('../../assets/MR_INT-005_WhiteNeons_NAD.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
      gltfLoader.load('../../assets/caja_corazon.glb', (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);
      });
    });
  }

  createTextPlane(): void {
    const planeGeometry = new THREE.PlaneGeometry(this.maxTextWidth, this.maxLines * this.lineHeight);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    this.textPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.textPlane.position.set(0, 4, 0);
    this.scene.add(this.textPlane);
  }

  onUpdateText(): void {
    const newText = this.textInput.nativeElement.value;
    this.updateText(newText);
  }

  updateText(newText: string): void {
    // Remove previous text meshes
    this.textMeshes.forEach(mesh => this.scene.remove(mesh));
    this.textMeshes = [];

    this.fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const lines = this.breakTextIntoLines(newText, font, this.maxTextWidth);

      const scaleFactor = Math.min(1, this.maxLines / lines.length);
      const textSize = this.baseTextSize * scaleFactor;

      lines.forEach((line, index) => {
        const textGeometry = new TextGeometry(line, {
          font: font,
          size: textSize,
          height: 0.1,
          curveSegments: 12,
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;

        // Scale text if it exceeds the max width
        if (textWidth > this.maxTextWidth) {
          const scale = this.maxTextWidth / textWidth;
          textMesh.scale.set(scale * textSize / this.baseTextSize, scale * textSize / this.baseTextSize, 1);
        } else {
          textMesh.scale.set(textSize / this.baseTextSize, textSize / this.baseTextSize, 1);
        }

        // Position the text mesh within the plane
        textMesh.position.set(-this.maxTextWidth / 2, -index * this.lineHeight * scaleFactor, 3.5);
        this.textPlane!.add(textMesh);
        this.textMeshes.push(textMesh);
      });

      // Adjust text plane size based on the content
      const planeHeight = Math.min(this.maxLines, lines.length) * this.lineHeight * scaleFactor;
      this.textPlane!.geometry = new THREE.PlaneGeometry(this.maxTextWidth, planeHeight);
    });
  }

  breakTextIntoLines(text: string, font: any, maxWidth: number): string[] {
    const lines: string[] = [];
    const words = text.split(' ');
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testGeometry = new TextGeometry(testLine, { font: font, size: this.baseTextSize, height: 0.1, curveSegments: 12 });
      testGeometry.computeBoundingBox();
      const testWidth = testGeometry.boundingBox!.max.x - testGeometry.boundingBox!.min.x;

      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    // Limit the number of lines
    return lines.slice(0, this.maxLines);
  }
}