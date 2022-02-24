import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabuleirosPageRoutingModule } from './tabuleiros-routing.module';

import { TabuleirosPage } from './tabuleiros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabuleirosPageRoutingModule
  ],
  declarations: [TabuleirosPage]
})
export class TabuleirosPageModule {}
