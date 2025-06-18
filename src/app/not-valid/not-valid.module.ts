import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotValidPageRoutingModule } from './not-valid-routing.module';

import { NotValidPage } from './not-valid.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotValidPageRoutingModule
  ],
  declarations: [NotValidPage]
})
export class NotValidPageModule {}
