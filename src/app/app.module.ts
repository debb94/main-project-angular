import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { AdministracionModule } from './administracion/administracion.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppComponent } from './app.component';
import { KaysenComponent } from './kaysen/kaysen.component';
import { KaysenMenuComponent } from './kaysen/kaysen-menu/kaysen-menu.component';
import { KaysenEncabezadoComponent } from './kaysen/kaysen-encabezado/kaysen-encabezado.component';
import { ComplejoDialog } from './dialogs/complejos/complejo.dialog.component'
import { EmpresaDialog } from './dialogs/empresas/empresa.dialog.component';
import { UsuarioDialog } from './dialogs/usuarios/usuario.dialog.component';
import { UsuariosEmpresasDialog } from './dialogs/usuarios-empresas/usuarios-empresas.dialog.component';
import { UsuariosAdministradoresDialog } from './dialogs/usuarios-administradores/usuarios-administradores.dialog.component';

// ngx mask
import {NgxMaskModule, IConfig} from 'ngx-mask';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InicioComponent } from './inicio/inicio.component';
import { ReportesModule } from './reportes/reportes.module';
export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    AppComponent,
    KaysenComponent,
    KaysenMenuComponent,
    KaysenEncabezadoComponent,
    ComplejoDialog,
    EmpresaDialog,
    UsuariosEmpresasDialog,
    UsuariosAdministradoresDialog,
    InicioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    LoginModule,
    HomeModule,
    AdministracionModule,
    ConfiguracionModule,
    ReportesModule,
    CKEditorModule,
    NgxMaskModule.forRoot(options)
  ],
  entryComponents:[
    ComplejoDialog,
    EmpresaDialog,
    UsuariosEmpresasDialog,
    UsuariosAdministradoresDialog,
  ],
  providers: [KaysenComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
