import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardEditPage } from './board-edit.page';

const routes: Routes = [
  {
    path: '',
    component: BoardEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardEditPageRoutingModule {}
