import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EscenaComponent } from './escena/escena.component';
import { PruebaCanvasComponent } from './prueba-canvas/prueba-canvas.component';
import { FormsModule } from '@angular/forms';
import { CajasComponent } from './cajas/cajas.component';
import { CamisasComponent } from './camisas/camisas.component';

@NgModule({
  declarations: [
    AppComponent,
    EscenaComponent,
    PruebaCanvasComponent,
    CajasComponent,
    CamisasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
