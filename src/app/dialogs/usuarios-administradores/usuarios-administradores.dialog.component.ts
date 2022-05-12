import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateAdapter } from '@angular/material/core';
import { HandlerAppService } from 'src/app/services/handler-app.service';

@Component({
    selector: 'usuarios-administradores-dialog',
    templateUrl: 'usuarios-administradores.dialog.html',
})

export class UsuariosAdministradoresDialog{
    //variables
    view:string         =null;      // me indica la vista a mostrar
    usuarioAdministrador:any  =[];       // data del complejo que estoy detallando.
    title:string        =null;
    id:number           =null;      // registro a consultar.
    endpoint:string     = '/configuracion/usuarios-administradores';

    // update
    formUsuariosAdministradores:any;
    usuarios:any    =[];
    complejos:any    =[];
    status:any      =[
        {codigo:'',nombre:'Seleccione..'},
        {codigo:1,nombre:'Activo'},
        {codigo:0,nombre:'Inactivo'}
    ];


    // OUTPUTS
    @Output() loading    = new EventEmitter();
    @Output() reload     = new EventEmitter();

    constructor(
        public dialogRef: MatDialogRef<UsuariosAdministradoresDialog>,
        private WebApiService:WebApiService,
        private handler:HandlerAppService,
        private _adapter: DateAdapter<any>,
        @Inject(MAT_DIALOG_DATA) public data
    ){
        this._adapter.setLocale('us');
        this.view = this.data.window;
        this.id = null;
        switch(this.view){
            case 'view':
                this.id          = this.data.codigo;
                this.title  ="Usuario administrador #"+this.id;
                this.loading.emit(true);
                this.WebApiService.getRequest(this.endpoint+'/'+this.id,{})
                .subscribe(
                    data=>{
                        if(data.success == true){
                            this.usuarioAdministrador = data.data[0];
                            this.loading.emit(false);
                        }else{
                            this.handler.handlerError(data);
                            this.closeDialog();
                            this.loading.emit(false);
                        }
                    },
                    error=>{
                        this.handler.showError('Se produjo un error');
                        this.loading.emit(false);
                    }
                );
            break;
            case 'update':
                this.initForms();
                this.id          = this.data.codigo;
                this.title  = "Edición de usuario administrador #"+this.id;
            break;
            case 'create':
                this.initForms();
                this.title = "Crear relación usuario administrador";
            break;
        }
    }

    initForms(){
        this.getDataInit();
        this.formUsuariosAdministradores = new FormGroup({
            usuario_id:            new FormControl('',[Validators.required]),
            complejo_id:           new FormControl('',[Validators.required])
        });
    }
    dateKeys(event){
        return false;
    }

    getDataInit(){
        this.WebApiService.getRequest(this.endpoint,{
            action: 'getParamsUpdate'
        })
        .subscribe(
            data=>{
                if(data.success == true){
                    let datos = data.data[0];
                    // USUARIOS
                    let dataUsuarios = JSON.parse(datos.usuarios);
                    if(dataUsuarios!= null && dataUsuarios!= ""){
                      let usuarios = Array();
                      for(let i in dataUsuarios){
                        if(dataUsuarios[i].toLowerCase() != 'todas' ){
                          usuarios.push({
                            codigo:    i,
                            nombre:    dataUsuarios[i]
                          })
                        }
                      }
                      this.usuarios = usuarios;
                    }
                    // COMPLEJOS
                    let dataComplejos = JSON.parse(datos.complejos);
                    if(dataComplejos!= null && dataComplejos!= ""){
                      let complejos = Array();
                      for(let i in dataComplejos){
                        if(dataComplejos[i].toLowerCase() != 'todas' ){
                          complejos.push({
                            codigo:    i,
                            nombre:    dataComplejos[i]
                          })
                        }
                      }
                      this.complejos = complejos;
                    }

                    this.loading.emit(false);
                    if(this.view == 'update'){
                        this.getDataUpdate();
                    }
                }else{
                    this.handler.handlerError(data);
                    this.loading.emit(false);
                }
            },
            error=>{
                // console.log(error);
                this.handler.showError('Se produjo un error');
            }
        );
    }

    getDataUpdate(){
        /* this.WebApiService.getRequest('/configuracion/presupuestos/'+this.id,{})
        .subscribe(
            data=>{
                if(data.success){
                    this.usuarioAdministrador = data.data[0];
                    this.formUsuariosAdministradores.get('usuario').setValue(parseInt(this.usuarioAdministrador.complejo_id));
                    this.formUsuariosAdministradores.get('presupuesto_valor').setValue(parseFloat(this.usuarioAdministrador.presupuesto_valor));
                    let dateVigencia = new Date(this.usuarioAdministrador.presupuesto_fvigencia+" 00:00:00");
                    let dateVencimiento = new Date(this.usuarioAdministrador.presupuesto_fvencimiento+" 00:00:00");
                    this.formUsuariosAdministradores.get('presupuesto_fvigencia').setValue(dateVigencia);
                    this.formUsuariosAdministradores.get('presupuesto_fvencimiento').setValue(dateVencimiento);
                    this.formUsuariosAdministradores.get('presupuesto_estado').setValue(this.usuarioAdministrador.presupuesto_estado);
                    this.loading.emit(false);
                }else{
                    this.handler.handlerError(data);
                    this.closeDialog();
                    this.loading.emit(false);
                }
            },
            error=>{
                this.handler.showError('Se produjo un error');
                this.loading.emit(false);
            }
        ); */
        
    }


    closeDialog(){
        this.dialogRef.close();
    }

    onSubmitUpdate(){
        /* if(this.formUsuario.get('usuario_username').value.toLowerCase() == this.formUsuario.get('usuario_username2').value.toLowerCase()){
            if(this.formUsuario.valid){
                let usuario = this.formUsuario.value;
                let dataUsuario = {};
                for(let i in usuario){
                    if(i != 'usuario_username2'){
                        dataUsuario[i] = usuario[i].toLowerCase();
                    }
                }
                let body = {
                    formulario: dataUsuario,
                    formulario2:this.formPersona.value,
                    formulario3:this.formPerfil.value
                }
                this.loading.emit(true);
                this.WebApiService.putRequest(this.endpoint+'/'+this.id,body,{})
                .subscribe(
                    data=>{
                        if(data.success){
                            Swal.fire({
                                title: '',
                                text: data.message,
                                icon: null
                            });
                            this.reload.emit();
                            this.closeDialog();
                        }else{
                            this.handler.handlerError(data);
                            this.loading.emit(false);
                        }
                    },
                    error=>{
                        this.handler.showError('Se produjo un error');
                        this.loading.emit(false);
                    }
                );
            }else{
                Swal.fire({
                    title: '',
                    text: 'Ingrese la información solicitada',
                    icon: 'warning'
                });
            }
        }else{
            Swal.fire({
                title: '',
                text: 'Los usuarios no coinciden',
                icon: 'warning'
            });
        } */
    }

    onSubmit(){
        if(this.formUsuariosAdministradores.valid){
            
            let body = {
                formulario: this.formUsuariosAdministradores.value,
            }
            this.loading.emit(true);
            this.WebApiService.postRequest(this.endpoint,body,{})
            .subscribe(
                data=>{
                    if(data.success){
                        Swal.fire({
                            title: '',
                            text: data.message,
                            icon: null
                        });
                        this.reload.emit();
                        this.closeDialog();
                    }else{
                        this.handler.handlerError(data);
                        this.loading.emit(false);
                    }
                },
                error=>{
                    this.handler.showError('Se produjo un error');
                    this.loading.emit(false);
                }
            );
        }else{
            Swal.fire({
                title: '',
                text: 'Ingrese la información solicitada',
                icon: 'warning'
            });
        }
    }
}
