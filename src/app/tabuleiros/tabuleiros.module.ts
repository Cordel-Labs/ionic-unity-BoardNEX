import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabuleirosPageRoutingModule } from './tabuleiros-routing.module';

import { TabuleirosPage } from './tabuleiros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TabuleirosPageRoutingModule
  ],
  declarations: [TabuleirosPage]
})
export class TabuleirosPageModule {}
