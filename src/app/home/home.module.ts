import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatProgressSpinnerModule,
    ChartsModule
  ]
})
export class HomeModule { }
