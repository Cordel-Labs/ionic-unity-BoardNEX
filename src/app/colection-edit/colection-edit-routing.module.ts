import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColectionEditPage } from './colection-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ColectionEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColectionEditPageRoutingModule {}
