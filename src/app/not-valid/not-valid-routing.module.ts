import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotValidPage } from './not-valid.page';

const routes: Routes = [
  {
    path: '',
    component: NotValidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotValidPageRoutingModule {}
