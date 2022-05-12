import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { UsuariosEmpresasComponent } from './usuarios-empresas/usuarios-empresas.component';
import { UsuariosAdministradoresComponent } from './usuarios-administradores/usuarios-administradores.component';

const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'cuentas',
    component: CuentaComponent
  },
  {
    path: 'cuentas/:action',
    component: CuentaComponent
  },
  {
    path: 'usuarios-empresas',
    component: UsuariosEmpresasComponent
  },
  {
    path: 'usuarios-administradores',
    component: UsuariosAdministradoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
