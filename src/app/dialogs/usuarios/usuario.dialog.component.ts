import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateAdapter } from '@angular/material/core';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import { config } from './../../data-config';

@Component({
    selector: 'usuario-dialog',
    templateUrl: 'usuario.dialog.html',
})

export class UsuarioDialog{
    //variables
    view:string         =null;      // me indica la vista a mostrar
    usuario:any        =[];       // data del complejo que estoy detallando.
    title:string        =null;
    id:number           =null;      // registro a consultar.

    endpoint    = "/administracion/usuarios";
    maskphone = config.maskPhone;

    // update
    formUsuario:any;
    formPersona:any;
    formPerfil:any;
    usuarios:any    =[];
    estadoCivil:any =[];
    sexo:any        =[];
    perfiles:any    =[];
    propiedades:any =[];
    status:any      =[
        {codigo:'',nombre:'Seleccione..'},
        {codigo:1,nombre:'Activo'},
        {codigo:0,nombre:'Inactivo'}
    ];


    // OUTPUTS
    @Output() loading    = new EventEmitter();
    @Output() reload     = new EventEmitter();

    constructor(
        public dialogRef: MatDialogRef<UsuarioDialog>,
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
                            this.usuario = data.data[0];
                            if(this.usuario.propiedades != null){
                                this.propiedades = JSON.parse(this.usuario.propiedades);
                            }else{
                                this.propiedades = [];
                            }
                            console.log(this.propiedades);
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
                this.title  = "Edición de Usuario #"+this.id;
            break;
            case 'create':
                this.initForms();
                this.title = "Crear usuario";
            break;
        }
    }

    initForms(){
        this.getDataInit();
        this.formPersona = new FormGroup({
            persona_nombre1:            new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]),
            persona_nombre2:            new FormControl(''),
            persona_apellido1:          new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]),
            persona_apellido2:          new FormControl(''),
            persona_sexo:               new FormControl('',[Validators.required]),
            persona_email:              new FormControl('',[Validators.required,Validators.email,Validators.minLength(8)]),
            persona_telefono:           new FormControl('',[Validators.required]),
            persona_telefono2:          new FormControl(''),
            persona_fechanacimiento:    new FormControl(''),
            persona_ocupacion:          new FormControl(''),
            persona_estadocivil:        new FormControl('')
        });
        this.formUsuario = new FormGroup({
            usuario_username:           new FormControl('',[Validators.required,Validators.email]),
            usuario_username2:           new FormControl('',[Validators.required,Validators.email])
        });
        this.formPerfil = new FormGroup({
            perfil_id: new FormControl('',Validators.required)
        });
    }
    dateKeys(event){
        return false;
    }
    getDataInit(){
        switch(this.view){
            case 'update':
                this.WebApiService.getRequest('/administracion/usuarios',{
                    action: 'getParamsUpdate'
                })
                .subscribe(
                    data=>{
                        if(data.success == true){
                            let datos = data.data[0];
                            // ESTADOS CIVILES
                            let dataEstadosCiviles = JSON.parse(datos.estado_civil);
                            if(dataEstadosCiviles!= null && dataEstadosCiviles!= ""){
                              let estadoCivil = Array();
                              for(let i in dataEstadosCiviles){
                                if(dataEstadosCiviles[i].toLowerCase() != 'todas' ){
                                  estadoCivil.push({
                                    codigo:    i,
                                    nombre:    dataEstadosCiviles[i]
                                  })
                                }
                              }
                              this.estadoCivil = estadoCivil;
                            }
                            // SEXO
                            let dataSexo = JSON.parse(datos.sexo);
                            if(dataSexo!= null && dataSexo!= ""){
                              let sexo = Array();
                              for(let i in dataSexo){
                                if(dataSexo[i].toLowerCase() != 'todas' ){
                                  sexo.push({
                                    codigo:    i,
                                    nombre:    dataSexo[i]
                                  })
                                }
                              }
                              this.sexo = sexo;
                            }
                            // PERFILES
                            let dataPerfiles = JSON.parse(datos.perfiles);
                            if(dataPerfiles!= null && dataPerfiles!= ""){
                              let perfiles = Array();
                              for(let i in dataPerfiles){
                                if(dataPerfiles[i].toLowerCase() != 'todas' ){
                                  perfiles.push({
                                    codigo:    parseInt(i),
                                    nombre:    dataPerfiles[i]
                                  })
                                }
                              }
                              this.perfiles = perfiles;
                            }
                            this.getDataUpdate();
                        }else{
                            this.handler.handlerError(data);
                            this.closeDialog();
                            this.loading.emit(false);
                        }
                    },
                    error=>{
                        console.log(error);
                    }
                );
            break;
            case 'create':
                this.WebApiService.getRequest('/administracion/usuarios',{
                    action: 'getParamsUpdate'
                })
                .subscribe(
                    data=>{
                        if(data.success){
                            let datos = data.data[0];
                            // ESTADOS CIVILES
                            let dataEstadosCiviles = JSON.parse(datos.estado_civil);
                            if(dataEstadosCiviles!= null && dataEstadosCiviles!= ""){
                              let estadoCivil = Array();
                              for(let i in dataEstadosCiviles){
                                if(dataEstadosCiviles[i].toLowerCase() != 'todas' ){
                                  estadoCivil.push({
                                    codigo:    i,
                                    nombre:    dataEstadosCiviles[i]
                                  })
                                }
                              }
                              this.estadoCivil = estadoCivil;
                            }
                            // SEXO
                            let dataSexo = JSON.parse(datos.sexo);
                            if(dataSexo!= null && dataSexo!= ""){
                              let sexo = Array();
                              for(let i in dataSexo){
                                if(dataSexo[i].toLowerCase() != 'todas' ){
                                  sexo.push({
                                    codigo:    i,
                                    nombre:    dataSexo[i]
                                  })
                                }
                              }
                              this.sexo = sexo;
                            }
                            // PERFILES
                            let dataPerfiles = JSON.parse(datos.perfiles);
                            if(dataPerfiles!= null && dataPerfiles!= ""){
                              let perfiles = Array();
                              for(let i in dataPerfiles){
                                if(dataPerfiles[i].toLowerCase() != 'todas' ){
                                  perfiles.push({
                                    codigo:    parseInt(i),
                                    nombre:    dataPerfiles[i]
                                  })
                                }
                              }
                              this.perfiles = perfiles;
                            }
                            this.loading.emit(false);
                        }else{
                            this.handler.handlerError(data);
                            this.closeDialog();
                            this.loading.emit(false);
                        }
                    },
                    error=>{
                        console.log(error);
                    }
                );
            break;
        }
    }

    getDataUpdate(){
        this.WebApiService.getRequest('/administracion/usuarios/'+this.id,{})
        .subscribe(
            data=>{
                if(data.success){
                    this.usuario = data.data[0];
                    this.formPersona.get('persona_nombre1').setValue(this.usuario.persona_nombre1);
                    this.formPersona.get('persona_nombre2').setValue(this.usuario.persona_nombre2);
                    this.formPersona.get('persona_apellido1').setValue(this.usuario.persona_apellido1);
                    this.formPersona.get('persona_apellido2').setValue(this.usuario.persona_apellido2);
                    this.formPersona.get('persona_sexo').setValue(this.usuario.persona_sexo);
                    this.formPersona.get('persona_email').setValue(this.usuario.persona_email);
                    this.formPersona.get('persona_telefono').setValue(this.usuario.persona_telefono);
                    this.formPersona.get('persona_telefono2').setValue(this.usuario.persona_telefono2);
                    let da = new Date(this.usuario.persona_fechanacimiento+' 00:00:00');
                    this.formPersona.get('persona_fechanacimiento').setValue(da);
                    this.formPersona.get('persona_ocupacion').setValue(this.usuario.persona_ocupacion);
                    this.formPersona.get('persona_estadocivil').setValue(this.usuario.persona_estadocivil);
                    
                    this.formPerfil.get('perfil_id').setValue(this.usuario.perfil_id);
                    
                    this.loading.emit(false);
                }else{
                    this.handler.handlerError(data);
                    this.closeDialog();
                    this.loading.emit(false);
                }
            },
            error=>{
                console.log(error);
                this.loading.emit(false);
            }
        );
        
    }


    closeDialog(){
        this.dialogRef.close();
    }

    onSubmitUpdate(){
        let user = this.formPersona.get('persona_email').value.toLowerCase();
        this.formUsuario.get('usuario_username').setValue(user);
        this.formUsuario.get('usuario_username2').setValue(user);

        if(this.formUsuario.get('usuario_username').value == this.formUsuario.get('usuario_username2').value){
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
                this.WebApiService.putRequest('/administracion/usuarios/'+this.id,body,{})
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
                        this.handler.showError();
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
        }
    }

    onSubmit(){
        let user = this.formPersona.get('persona_email').value.toLowerCase();
        this.formUsuario.get('usuario_username').setValue(user);
        this.formUsuario.get('usuario_username2').setValue(user);

        if(this.formUsuario.get('usuario_username').value == this.formUsuario.get('usuario_username2').value){
            if(this.formUsuario.valid && this.formPersona.valid && this.formPerfil.valid){
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
                this.WebApiService.postRequest('/administracion/usuarios',body,{})
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
                this.handler.validateAllFields(this.formUsuario); 
                this.handler.validateAllFields(this.formPersona); 
                this.handler.validateAllFields(this.formPerfil); 
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
        }
    }


    // onChange(event){
    //     switch(event.source.ngControl.name){
    //         case 'complejo_id':
    //             this.formUsuario.get('edificio_id').setValue('');
    //             this.WebApiService.getRequest('/administracion/usuarios',{
    //                 action: 'getEdificios',
    //                 complejo_id: this.formUsuario.get('complejo_id').value
    //             })
    //             .subscribe(
    //                 data=>{
    //                     if(data.success){
    //                        this.usuario = data.data;
    //                     }else{
    //                         Swal.fire({
    //                             title: '',
    //                             text: data.message,
    //                             icon: null
    //                         });
    //                     }
    //                 },
    //                 error=>{
    //                     Swal.fire({
    //                         title: '',
    //                         text: 'Se produjo un error',
    //                         icon: null
    //                     });
    //                 }
    //             );
    //         break;
    //     }
    // }



    // validateAllFields(formGroup: FormGroup) {         
    //     Object.keys(formGroup.controls).forEach(field => {  
    //         const control = formGroup.get(field);            
    //         if (control instanceof FormControl) {             
    //             control.markAsTouched({ onlySelf: true });
    //         } else if (control instanceof FormGroup) {        
    //             this.validateAllFields(control);  
    //         }
    //     });
    // }

}
