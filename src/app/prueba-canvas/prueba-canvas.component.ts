import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { EscenaComponent } from '../escena/escena.component';
@Component({
  selector: 'app-prueba-canvas',
  templateUrl: './prueba-canvas.component.html',
  styleUrls: ['./prueba-canvas.component.scss'],
  //providers:[EscenaComponent]

})
export class PruebaCanvasComponent {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement> | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private image = new Image();
  private imageUrl: string | null = null;
  private scale = 1;
  private pos = { x: 0, y: 0 };
  private draggingCorner: string | null = null;
  private controlSize = 10;

  constructor(private escenaComponent: EscenaComponent) {}

  ngOnInit() {
    this.ctx = this.canvas!.nativeElement.getContext('2d');
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
      this.image.src = this.imageUrl!;
      this.image.onload = () => this.fitImageToCanvas();
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  //evalua el tamaño del canvas y de la imagen los compara y los escala para que la imagen no sobrepase al canvas
  private fitImageToCanvas() {
    const canvas = this.canvas!.nativeElement;
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = this.image.width / this.image.height;

    if (imageAspect > canvasAspect) {
      this.scale = canvas.width / this.image.width;
    } else {
      this.scale = canvas.height / this.image.height;
    }

    this.pos.x = (canvas.width - this.image.width * this.scale) / 2;
    this.pos.y = (canvas.height - this.image.height * this.scale) / 2;
    this.drawImage();
  }

  private drawImage() {
    const canvas = this.canvas!.nativeElement;
    //limpia el canvas
    this.ctx!.clearRect(0, 0, canvas.width, canvas.height);
    //calcula el alto y ancho de la imagen
    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;
    //agrega la imagen al canvas
    this.ctx!.drawImage(this.image, this.pos.x, this.pos.y, width, height);
    //llama a la funcion de dibujar punto
    this.drawControls();
    //llama a la funcion que remplaza la textura del modelo 3d
    this.updateModelTexture();
  }

  private drawControls() {
    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;
    const middleX = this.pos.x + width / 2;
    const middleY = this.pos.y + height / 2;

    // dibuja la esquinas mediante la posicion
    this.drawControlPoint(this.pos.x, this.pos.y); // top-left
    this.drawControlPoint(this.pos.x + width, this.pos.y); // top-right
    this.drawControlPoint(this.pos.x, this.pos.y + height); // bottom-left
    this.drawControlPoint(this.pos.x + width, this.pos.y + height); // bottom-right

    // dibuja los puntos mdeios mediante la posicion
    this.drawControlPoint(middleX, this.pos.y); // middle-top
    this.drawControlPoint(this.pos.x, middleY); // middle-left
    this.drawControlPoint(this.pos.x + width, middleY); // middle-right
    this.drawControlPoint(middleX, this.pos.y + height); // middle-bottom
  }

  private drawControlPoint(x: number, y: number) {
    // le da d¿forma y color a los puntos
    this.ctx!.fillStyle = 'blue';
    this.ctx!.fillRect(x - this.controlSize / 2, y - this.controlSize / 2, this.controlSize, this.controlSize);
  }

  //evento que se amntine escuchando cuando se preciona el click
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const corner = this.getCornerUnderMouse(event.offsetX, event.offsetY);
    if (corner) {
      this.draggingCorner = corner;
      return;
    }
    const startX = event.offsetX - this.pos.x;
    const startY = event.offsetY - this.pos.y;
    // calcula las posiciones en las que se encuentra el mouse para llamar a la funcion que redibuje y escale la imagen
    const onMouseMove = (e: MouseEvent) => {
      this.pos.x = e.offsetX - startX;
      this.pos.y = e.offsetY - startY;
      this.drawImage();
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.draggingCorner) {
      // llama a la funcion que escala la imagen
      this.resizeImage(event.offsetX, event.offsetY);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.draggingCorner = null;
  }
//esta funcion se usa para identificar que punto de control es el que se pulsa
  private getCornerUnderMouse(x: number, y: number) {
    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;

    if (this.isPointInControl(x, y, this.pos.x, this.pos.y)) return 'top-left';
    if (this.isPointInControl(x, y, this.pos.x + width, this.pos.y)) return 'top-right';
    if (this.isPointInControl(x, y, this.pos.x, this.pos.y + height)) return 'bottom-left';
    if (this.isPointInControl(x, y, this.pos.x + width, this.pos.y + height)) return 'bottom-right';

    const middleX = this.pos.x + width / 2;
    const middleY = this.pos.y + height / 2;
    if (this.isPointInControl(x, y, middleX, this.pos.y)) return 'middle-top';
    if (this.isPointInControl(x, y, this.pos.x, middleY)) return 'middle-left';
    if (this.isPointInControl(x, y, this.pos.x + width, middleY)) return 'middle-right';
    if (this.isPointInControl(x, y, middleX, this.pos.y + height)) return 'middle-bottom';

    return null;
  }
//segun mi tutor esto evalua si el puntero del mouse se encuentra sobre uno de los punto de control para empezar a renderizar puesto que el evento que s eusa par aidentificar los click siempre esta escuhando
  private isPointInControl(px: number, py: number, cx: number, cy: number): boolean {
    return px >= cx - this.controlSize / 2 && px <= cx + this.controlSize / 2 &&
      py >= cy - this.controlSize / 2 && py <= cy + this.controlSize / 2;
  }
// esta funcion identifica cual punto se pulso y empieza a escalar la imagen segun la posicion y las dimensiones de la imagen
  private resizeImage(mouseX: number, mouseY: number) {
    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;
    let newWidth = width;
    let newHeight = height;

    switch (this.draggingCorner) {
      case 'top-left':
        newWidth = width + (this.pos.x - mouseX);
        newHeight = height + (this.pos.y - mouseY);
        this.pos.x = mouseX;
        this.pos.y = mouseY;
        break;
      case 'top-right':
        newWidth = mouseX - this.pos.x;
        newHeight = height + (this.pos.y - mouseY);
        this.pos.y = mouseY;
        break;
      case 'bottom-left':
        newWidth = width + (this.pos.x - mouseX);
        newHeight = mouseY - this.pos.y;
        this.pos.x = mouseX;
        break;
      case 'bottom-right':
        newWidth = mouseX - this.pos.x;
        newHeight = mouseY - this.pos.y;
        break;
      case 'middle-top':
        newHeight = height + (this.pos.y - mouseY);
        this.pos.y = mouseY;
        break;
      case 'middle-left':
        newWidth = width + (this.pos.x - mouseX);
        this.pos.x = mouseX;
        break;
      case 'middle-right':
        newWidth = mouseX - this.pos.x;
        break;
      case 'middle-bottom':
        newHeight = mouseY - this.pos.y;
        break;
    }

    const newScale = Math.min(newWidth / this.image.width, newHeight / this.image.height);
    if (newScale > 0) {
      this.scale = newScale;
      this.drawImage(); // Redibujar completamente la imagen
    }
  }

  private updateModelTexture() {

    if (this.canvas) {
    // Crear un canvas temporal
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      // Establecer el tamaño del canvas temporal
      tempCanvas.width = this.canvas.nativeElement.width;
      tempCanvas.height = this.canvas.nativeElement.height;

      // Dibujar la imagen en el canvas temporal
      const width = this.image.width * this.scale;
      const height = this.image.height * this.scale;
      tempCtx.drawImage(this.image, this.pos.x, this.pos.y, width, height);

      // Llamar a la función del componente escena con el canvas temporal
      this.escenaComponent.updateModelTexture(tempCanvas);
    }
  }
  }
}