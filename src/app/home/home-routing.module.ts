import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from '../services/auth-guard.service';


const routes: Routes = [
  {
    path:'',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  // {
  //   path:'home',
  //   component:HomeComponent,
  //   canActivate: [AuthGuardService]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
