import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardEditPageRoutingModule } from './board-edit-routing.module';

import { BoardEditPage } from './board-edit.page';
import { UnityComponentComponent } from '../unity-component/unity-component.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BoardEditPageRoutingModule
  ],
  declarations: [BoardEditPage, UnityComponentComponent]
})
export class BoardEditPageModule {}
