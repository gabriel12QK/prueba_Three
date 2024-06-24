import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PruebaCanvasComponent } from '../prueba-canvas/prueba-canvas.component';
@Component({
  selector: 'app-camisas',
  templateUrl: './camisas.component.html',
  styleUrls: ['./camisas.component.scss'],
 
})
export class CamisasComponent {
  shirtImageUrl: string = 'assets/img/frente.png'; // URL de la imagen de fondo (camisa)
  logoImageUrl: string | null = null; // Variable para almacenar la URL del logo

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}