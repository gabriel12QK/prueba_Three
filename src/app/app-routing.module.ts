import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajasComponent } from './cajas/cajas.component';
import { EscenaComponent } from './escena/escena.component';
import { CamisasComponent } from './camisas/camisas.component';

const routes: Routes = [
  {path: 'cajas',component:CajasComponent},
  {path: 'taza',component:EscenaComponent},
  {path: 'camisa',component:CamisasComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
