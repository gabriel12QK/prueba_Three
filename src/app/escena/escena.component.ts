import { animate } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import { PruebaCanvasComponent } from '../prueba-canvas/prueba-canvas.component';



@Component({
  selector: 'app-escena',
  templateUrl: './escena.component.html',
  styleUrls: ['./escena.component.scss'],
  providers:[PruebaCanvasComponent]
})

export class EscenaComponent implements AfterViewInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private model: THREE.Object3D | null = null;

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.loadModel();
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
      gltfLoader.load('../../assets/tasa.glb', (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);
      });
    });
  }

  updateModelTexture(canvas: HTMLCanvasElement): void {
    if (this.model) {
      console.log(this.model);
      const texture = new THREE.CanvasTexture(canvas);
      const capafoto = this.model.getObjectByName('CapaFoto') as THREE.Mesh;
      if (capafoto) {
        capafoto.material = new THREE.MeshBasicMaterial({ map: texture, });
        texture.flipY=false;
        texture.needsUpdate = true;
      }
    }
  }

}