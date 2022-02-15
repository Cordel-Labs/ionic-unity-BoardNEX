import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColectionEditPageRoutingModule } from './colection-edit-routing.module';

import { ColectionEditPage } from './colection-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ColectionEditPageRoutingModule
  ],
  declarations: [ColectionEditPage]
})
export class ColectionEditPageModule {}
