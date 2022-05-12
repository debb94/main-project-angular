import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CuentaComponent } from './cuenta/cuenta.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
// ngx mask
import {NgxMaskModule, IConfig} from 'ngx-mask';
import { UsuariosEmpresasComponent } from './usuarios-empresas/usuarios-empresas.component';
import { UsuariosAdministradoresComponent } from './usuarios-administradores/usuarios-administradores.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    UsuariosComponent,
    CuentaComponent,
    UsuariosEmpresasComponent,
    UsuariosAdministradoresComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatDialogModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(options),
  ],
  entryComponents:[
    
  ],
  providers: [  
    MatDatepickerModule,  
  ]
})
export class ConfiguracionModule { }
