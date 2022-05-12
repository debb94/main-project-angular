import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateAdapter } from '@angular/material/core';
import { HandlerAppService } from 'src/app/services/handler-app.service';

@Component({
    selector: 'usuarios-empresas-dialog',
    templateUrl: 'usuarios-empresas.dialog.html',
})

export class UsuariosEmpresasDialog{
    //variables
    view:string         =null;      // me indica la vista a mostrar
    usuarioEmpresa:any  =[];       // data del complejo que estoy detallando.
    title:string        =null;
    id:number           =null;      // registro a consultar.
    endpoint:string     = '/configuracion/usuarios-empresas';

    // update
    formUsuariosEmpresas:any;
    usuarios:any    =[];
    empresas:any    =[];
    status:any      =[
        {codigo:'',nombre:'Seleccione..'},
        {codigo:1,nombre:'Activo'},
        {codigo:0,nombre:'Inactivo'}
    ];


    // OUTPUTS
    @Output() loading    = new EventEmitter();
    @Output() reload     = new EventEmitter();

    constructor(
        public dialogRef: MatDialogRef<UsuariosEmpresasDialog>,
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
                this.title  ="Usuario #"+this.id;
                this.loading.emit(true);
                this.WebApiService.getRequest(this.endpoint+'/'+this.id,{})
                .subscribe(
                    data=>{
                        if(data.success == true){
                            this.usuarioEmpresa = data.data[0];
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
            // case 'update':
            //     this.initForms();
            //     this.id          = this.data.codigo;
            //     this.title  = "Edición de Usuario #"+this.id;
            // break;
            case 'create':
                this.initForms();
                this.title = "Crear relacion usuario empresa";
            break;
        }
    }

    initForms(){
        this.getDataInit();
        this.formUsuariosEmpresas = new FormGroup({
            usuario_id:            new FormControl('',[Validators.required]),
            empresa_id:            new FormControl('',[Validators.required])
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
                    // EMPRESAS
                    let dataEmpresas = JSON.parse(datos.empresas);
                    if(dataEmpresas!= null && dataEmpresas!= ""){
                      let empresas = Array();
                      for(let i in dataEmpresas){
                        if(dataEmpresas[i].toLowerCase() != 'todas' ){
                          empresas.push({
                            codigo:    i,
                            nombre:    dataEmpresas[i]
                          })
                        }
                      }
                      this.empresas = empresas;
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
                    this.usuarioEmpresa = data.data[0];
                    this.formUsuariosEmpresas.get('usuario').setValue(parseInt(this.usuarioEmpresa.complejo_id));
                    this.formUsuariosEmpresas.get('presupuesto_valor').setValue(parseFloat(this.usuarioEmpresa.presupuesto_valor));
                    let dateVigencia = new Date(this.usuarioEmpresa.presupuesto_fvigencia+" 00:00:00");
                    let dateVencimiento = new Date(this.usuarioEmpresa.presupuesto_fvencimiento+" 00:00:00");
                    this.formUsuariosEmpresas.get('presupuesto_fvigencia').setValue(dateVigencia);
                    this.formUsuariosEmpresas.get('presupuesto_fvencimiento').setValue(dateVencimiento);
                    this.formUsuariosEmpresas.get('presupuesto_estado').setValue(this.usuarioEmpresa.presupuesto_estado);
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
        this.loading.emit(true);
        if(this.formUsuariosEmpresas.valid){
            let body = {
                formulario: this.formUsuariosEmpresas.value,
            }
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
                        this.loading.emit(false);
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
            this.loading.emit(false);
        }
    }
}
