import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubirUbicacionPageRoutingModule } from './subir-ubicacion-routing.module';

import { SubirUbicacionPage } from './subir-ubicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubirUbicacionPageRoutingModule
  ],
  declarations: [SubirUbicacionPage]
})
export class SubirUbicacionPageModule {}
