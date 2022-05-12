import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComplejosComponent } from './complejos/complejos.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AprobarUsuariosComponent } from './aprobar-usuarios/aprobar-usuarios.component';


const routes: Routes = [
  {
    path: 'empresas',
    component: EmpresasComponent
  },
  {
    path: 'complejos',
    component: ComplejosComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'usuarios/:action',
    component: UsuariosComponent
  },
  {
    path: 'aprobar-usuarios',
    component: AprobarUsuariosComponent
  },
  // {
  //   path: 'administradores',
  //   component: adminis
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
