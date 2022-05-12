import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
// auth guard
// import { AuthGuardService } from './services/auth-guard.service';
// components
import { KaysenComponent } from './kaysen/kaysen.component';
import { AuthGuardService } from './services/auth-guard.service';
// import { LoginComponent } from './login/login/login.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: '',
    component: KaysenComponent,
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'administracion',
    loadChildren: './administracion/administracion.module#AdministracionModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'configuracion',
    loadChildren: './configuracion/configuracion.module#ConfiguracionModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'transacciones',
    loadChildren: './transacciones/transacciones.module#TransaccionesModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'productos',
    loadChildren: './productos/productos.module#ProductosModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'multas',
    loadChildren: './multas/multas.module#MultasModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'derramas',
    loadChildren: './derramas/derramas.module#DerramasModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'reportes',
    loadChildren: './reportes/reportes.module#ReportesModule',
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
