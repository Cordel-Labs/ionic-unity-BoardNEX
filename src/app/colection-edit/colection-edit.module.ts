import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColectionEditPageRoutingModule } from './colection-edit-routing.module';

import { ColectionEditPage } from './colection-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColectionEditPageRoutingModule
  ],
  declarations: [ColectionEditPage]
})
export class ColectionEditPageModule {}
