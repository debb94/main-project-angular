import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracionRoutingModule } from './administracion-routing.module';

import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';

import { ComplejosComponent } from './complejos/complejos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AprobarUsuariosComponent } from './aprobar-usuarios/aprobar-usuarios.component';
import { UsuarioDialog } from '../dialogs/usuarios/usuario.dialog.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    ComplejosComponent,
    UsuariosComponent,
    EmpresasComponent,
    AprobarUsuariosComponent,
    UsuarioDialog
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    NgxMaskModule.forRoot(options)
  ],
  entryComponents:[
    UsuarioDialog
  ]
})
export class AdministracionModule { }
