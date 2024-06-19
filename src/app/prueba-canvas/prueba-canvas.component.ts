import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { EscenaComponent } from '../escena/escena.component';
@Component({
  selector: 'app-prueba-canvas',
  templateUrl: './prueba-canvas.component.html',
  styleUrls: ['./prueba-canvas.component.scss'],
  //providers:[EscenaComponent]

})
// export class PruebaCanvasComponent {

//   @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>|null=null;
//   private ctx: CanvasRenderingContext2D|null=null;
//   private image = new Image();
//   private imageUrl: string | null = null;
//   private scale = 1;
//   private pos = { x: 0, y: 0 };
//   private draggingCorner: string | null = null;
//   private controlSize = 10;

//   constructor(
//     private escenaComponent: EscenaComponent
//   ) { }

//   ngOnInit() {
//     this.ctx = this.canvas!.nativeElement.getContext('2d');
//   }

//   onFileChange(event: any) {
//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       this.imageUrl = e.target.result;
//       this.image.src = this.imageUrl!;
//       this.image.onload = () => this.fitImageToCanvas();
//     };
//     reader.readAsDataURL(event.target.files[0]);
//   }

//   private fitImageToCanvas() {
//     const canvas = this.canvas!.nativeElement;
//     const canvasAspect = canvas!.width / canvas.height;
//     const imageAspect = this.image.width / this.image.height;

//     if (imageAspect > canvasAspect) {
//       this.scale = canvas.width / this.image.width;
//     } else {
//       this.scale = canvas.height / this.image.height;
//     }

//     this.pos.x = (canvas.width - this.image.width * this.scale) / 2;
//     this.pos.y = (canvas.height - this.image.height * this.scale) / 2;
//     this.drawImage();
//   }

//   private drawImage() {
//     const canvas = this.canvas!.nativeElement;
//     this.ctx!.clearRect(0, 0, canvas.width, canvas.height);
//     const width = this.image.width * this.scale;
//     const height = this.image.height * this.scale;
//     this.ctx!.drawImage(this.image, this.pos.x, this.pos.y, width, height);
//     this.drawControls();
//   }

//   private drawControls() {
//     const canvas = this.canvas!.nativeElement;
//     const width = this.image.width * this.scale;
//     const height = this.image.height * this.scale;
  
//     // Top-left
//     this.drawControlPoint(this.pos.x, this.pos.y);
  
//     // Top-right
//     this.drawControlPoint(this.pos.x + width, this.pos.y);
  
//     // Bottom-left
//     this.drawControlPoint(this.pos.x, this.pos.y + height);
  
//     // Bottom-right
//     this.drawControlPoint(this.pos.x + width, this.pos.y + height);
//   }
  
//   private drawControlPoint(x: number, y: number) {
//     this.ctx!.fillStyle = 'blue';
//     this.ctx!.fillRect(x - this.controlSize / 2, y - this.controlSize / 2, this.controlSize, this.controlSize);
//   }

 

//   @HostListener('mousedown', ['$event'])
//   onMouseDown(event: MouseEvent) {
//     const corner = this.getCornerUnderMouse(event.offsetX, event.offsetY);
//     if (corner) {
//       this.draggingCorner = corner;
//       return;
//     }
  
//     const onMouseMove = (e: MouseEvent) => {
//       if (this.draggingCorner) {
//         const offsetX = e.offsetX - event.offsetX;
//         const offsetY = e.offsetY - event.offsetY;
//         switch (this.draggingCorner) {
//           case 'top-left':
//             this.pos.x += offsetX;
//             this.pos.y += offsetY;
//             this.scale -= offsetX / this.image.width;
//             break;
//           case 'top-right':
//             this.pos.y += offsetY;
//             this.scale += offsetX / this.image.width;
//             break;
//           case 'bottom-left':
//             this.pos.x += offsetX;
//             this.scale -= offsetX / this.image.width;
//             break;
//           case 'bottom-right':
//             this.scale += offsetX / this.image.width;
//             break;
//         }
//         this.drawImage();
//       }
//     };
  
//     const onMouseUp = () => {
//       this.draggingCorner = null;
//       window.removeEventListener('mousemove', onMouseMove);
//       window.removeEventListener('mouseup', onMouseUp);
//       this.updateModelTexture();
//     };
  
//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('mouseup', onMouseUp);
//   }

//   private getCornerUnderMouse(x: number, y: number): string | null {
//     const width = this.image.width * this.scale;
//     const height = this.image.height * this.scale;

//     if (this.isPointInControl(x, y, this.pos.x, this.pos.y)) return 'top-left';
//     if (this.isPointInControl(x, y, this.pos.x + width, this.pos.y)) return 'top-right';
//     if (this.isPointInControl(x, y, this.pos.x, this.pos.y + height)) return 'bottom-left';
//     if (this.isPointInControl(x, y, this.pos.x + width, this.pos.y + height)) return 'bottom-right';

//     return null;
//   }

//   private isPointInControl(px: number, py: number, cx: number, cy: number): boolean {
//     return px >= cx - this.controlSize / 2 && px <= cx + this.controlSize / 2 &&
//       py >= cy - this.controlSize / 2 && py <= cy + this.controlSize / 2;
//   }

//   private updateModelTexture() {
//     if (this.canvas) {
//       this.escenaComponent.updateModelTexture(this.canvas.nativeElement);
//     }
//   }
// }
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
    this.ctx!.clearRect(0, 0, canvas.width, canvas.height);
    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;
    this.ctx!.drawImage(this.image, this.pos.x, this.pos.y, width, height);
    this.drawControls();
    this.updateModelTexture();
  }

  private drawControls() {
    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;

    this.drawControlPoint(this.pos.x, this.pos.y);
    this.drawControlPoint(this.pos.x + width, this.pos.y);
    this.drawControlPoint(this.pos.x, this.pos.y + height);
    this.drawControlPoint(this.pos.x + width, this.pos.y + height);
  }

  private drawControlPoint(x: number, y: number) {
    this.ctx!.fillStyle = 'blue';
    this.ctx!.fillRect(x - this.controlSize / 2, y - this.controlSize / 2, this.controlSize, this.controlSize);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const corner = this.getCornerUnderMouse(event.offsetX, event.offsetY);
    if (corner) {
      this.draggingCorner = corner;
      return;
    }
    const startX = event.offsetX - this.pos.x;
    const startY = event.offsetY - this.pos.y;
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
      this.resizeImage(event.offsetX, event.offsetY);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.draggingCorner = null;
  }

  private getCornerUnderMouse(x: number, y: number) {
    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;

    if (this.isPointInControl(x, y, this.pos.x, this.pos.y)) return 'top-left';
    if (this.isPointInControl(x, y, this.pos.x + width, this.pos.y)) return 'top-right';
    if (this.isPointInControl(x, y, this.pos.x, this.pos.y + height)) return 'bottom-left';
    if (this.isPointInControl(x, y, this.pos.x + width, this.pos.y + height)) return 'bottom-right';

    return null;
  }

  private isPointInControl(px: number, py: number, cx: number, cy: number): boolean {
    return px >= cx - this.controlSize / 2 && px <= cx + this.controlSize / 2 &&
           py >= cy - this.controlSize / 2 && py <= cy + this.controlSize / 2;
  }

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
    }

    const newScale = Math.min(newWidth / this.image.width, newHeight / this.image.height);
    if (newScale > 0) {
      this.scale = newScale;
      this.drawImage();
    }
  }

  private updateModelTexture() {
    if (this.canvas) {
      this.escenaComponent.updateModelTexture(this.canvas.nativeElement);
    }
  }
}