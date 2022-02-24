import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabuleirosPage } from './tabuleiros.page';

const routes: Routes = [
  {
    path: '',
    component: TabuleirosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabuleirosPageRoutingModule {}
