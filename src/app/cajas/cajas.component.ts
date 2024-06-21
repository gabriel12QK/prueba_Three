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

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private model: THREE.Object3D | null = null;
  private textMesh: THREE.Mesh | null = null;
  private textPlane: THREE.Mesh | null = null;
  private fontLoader = new FontLoader();
  private maxTextWidth = 8; // Adjust this value to your needs

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
    const planeGeometry = new THREE.PlaneGeometry(this.maxTextWidth, 5);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 'blue',
      transparent: false,
      opacity: 0.5
    });
    this.textPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.textPlane.position.set(0, 2, 0);
    this.scene.add(this.textPlane);
  }

  updateText(newText: string): void {
    if (this.textMesh) {
      this.scene.remove(this.textMesh);
    }

    this.fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry(newText, {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 12,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
      
      // Calculate bounding box of the text
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;

      // Scale text if it exceeds the max width
      if (textWidth > this.maxTextWidth) {
        const scale = this.maxTextWidth / textWidth;
        this.textMesh.scale.set(scale, scale, scale);
      }

      // Position the text mesh within the plane
      this.textMesh.position.set(-this.maxTextWidth / 2, 0, 4);
      this.textPlane!.add(this.textMesh);
    });
  }

  onTextChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const newText = input.value;
    this.updateText(newText);
  }
}