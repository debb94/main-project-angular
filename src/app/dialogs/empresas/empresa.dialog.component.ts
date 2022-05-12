import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import { config } from './../../data-config';
import { finalize } from 'rxjs/internal/operators/finalize';


@Component({
    selector: 'empresa-dialog',
    templateUrl: 'empresa.dialog.html',
})

export class EmpresaDialog{
    endpoint            = '/administracion/empresas';
    //variables
    view:string         = null;     // me indica la vista a mostrar
    empresa:any         = []; // data del complejo que estoy detallando.
    title:string        = null;
    id:number           = null; // registro a consultar.
    maskphone           = config.maskPhone;


    // update
    formEmpresa:any;
    tipoDni:any     =[];
    tipoRelacion:any=[];
    paises:any      =[];
    estados:any     =[];
    ciudades:any    =[];
    status:any      =[
        {codigo:'',nombre:'Seleccione..'},
        {codigo:1,nombre:'Activo'},
        {codigo:0,nombre:'Inactivo'}
    ];


    // OUTPUTS
    @Output() loading    = new EventEmitter();
    @Output() reload     = new EventEmitter();

    constructor(
        public dialogRef: MatDialogRef<EmpresaDialog>,
        private WebApiService:WebApiService,
        private handler:HandlerAppService,
        @Inject(MAT_DIALOG_DATA) public data
    ){
        this.view = this.data.window;
        this.id = null;
        switch(this.view){
            case 'view':
                this.id         = this.data.codigo;
                this.title      = "Empresa #"+this.id;
                this.loading.emit(true);
                this.WebApiService.getRequest('/administracion/empresas/'+this.id,{})
                .subscribe(
                    data=>{
                        if(data.success){
                            this.loading.emit(false);
                            this.empresa = data.data[0];
                            this.title = "Empresa " +this.empresa.empresa_nombrecorto;
                        }else{
                            this.handler.handlerError(data);
                            this.closeDialog();
                            this.loading.emit(false);
                        }
                    },
                    error=>{
                        this.loading.emit(false);
                        this.handler.showError('Se produjo un error');
                    }
                );
            break;
            case 'update':
                this.initForms();
                this.id          = this.data.codigo;
                this.title  = "Edición de empresa #"+this.id;
            break;
            case 'create':
                this.initForms();
                this.title = "Crear empresa";
            break;
        }
    }

    initForms(){
        this.getDataInit();
        this.formEmpresa = new FormGroup({
            empresa_nombrecorto:        new FormControl('',[Validators.required]),
            empresa_razonsocial:        new FormControl('',[Validators.required]),
            empresa_tipodni:            new FormControl('',[Validators.required]),
            empresa_dni:                new FormControl('',[Validators.required]),
            empresa_tiporelacion:       new FormControl('',[Validators.required]),
            pais_codigo:                new FormControl('',[Validators.required]),
            estado_codigo:              new FormControl('',[Validators.required]),
            ciudad_codigo:              new FormControl('',[Validators.required]),
            empresa_direccion1:         new FormControl('',[Validators.required]),
            empresa_direccion2:         new FormControl(''),
            empresa_correo:             new FormControl('',[Validators.required]),
            empresa_telefono1:          new FormControl('',[Validators.required]),
            empresa_telefonoext1:       new FormControl(''),
            empresa_telefono2:          new FormControl(''),
            empresa_telefonoext2:       new FormControl(''),
            empresa_web:                new FormControl(''),
            empresa_estado:             new FormControl('',[Validators.required])
        });
    }

    getDataInit(){
        this.WebApiService.getRequest(this.endpoint,{
            action: 'getParamsUpdate'
        })
        .subscribe(
            data=>{
                if(data.success == true){
                    let datos = data.data[0];
                    this.paises         = this.handler.returnJsonToArray(datos.paises);
                    this.tipoDni        = this.handler.returnJsonToArray(datos.tipo_dni);
                    this.tipoRelacion   = this.handler.returnJsonToArray(datos.tipo_relacion);
                    
                    if(this.view == 'update'){
                        this.getDataUpdate();
                    }else{
                        this.loading.emit(false);
                    }
                }else{
                    this.handler.handlerError(data);
                    this.loading.emit(false);
                }
            },
            error=>{
                this.handler.showError('Se produjo un error');
            }
        );
    }

    getDataUpdate(){
        let dependencies = JSON.stringify(['estados','ciudades']);
        this.WebApiService.getRequest('/administracion/empresas/'+this.id,{
            dependencies    //dependencias por parte del registro a consultar.
        })
        .pipe(finalize(()=>{this.loading.emit(false)}))
        .subscribe(
            data=>{
                if(data.success){
                    this.empresa = data.data[0];
                    this.title = "Edición de "+ this.empresa.empresa_nombrecorto;
                    this.formEmpresa.get('empresa_nombrecorto').setValue(this.empresa.empresa_nombrecorto);
                    this.formEmpresa.get('empresa_razonsocial').setValue(this.empresa.empresa_razonsocial);
                    this.formEmpresa.get('empresa_tipodni').setValue(this.empresa.empresa_tipodni);
                    this.formEmpresa.get('empresa_dni').setValue(this.empresa.empresa_dni);
                    this.formEmpresa.get('empresa_tiporelacion').setValue(this.empresa.empresa_tiporelacion);
                    this.formEmpresa.get('pais_codigo').setValue(this.empresa.pais_codigo);
                    //dependencies
                    this.estados    = data.estados;
                    this.ciudades   = data.ciudades;
                    // this.estados.push({
                    //     codigo: this.empresa.estado_codigo,
                    //     nombre: this.empresa.estado_nombre
                    // });
                    // this.ciudades.push({
                    //     codigo: this.empresa.ciudad_codigo,
                    //     nombre: this.empresa.ciudad_nombre
                    // });
                    this.formEmpresa.get('estado_codigo').setValue(this.empresa.estado_codigo); 
                    this.formEmpresa.get('ciudad_codigo').setValue(this.empresa.ciudad_codigo);
    
                    this.formEmpresa.get('empresa_direccion1').setValue(this.empresa.empresa_direccion1);
                    this.formEmpresa.get('empresa_direccion2').setValue(this.empresa.empresa_direccion2);
                    this.formEmpresa.get('empresa_correo').setValue(this.empresa.empresa_correo);
                    this.formEmpresa.get('empresa_telefono1').setValue(this.empresa.empresa_telefono1);
                    this.formEmpresa.get('empresa_telefonoext1').setValue(this.empresa.empresa_telefonoext1);
                    this.formEmpresa.get('empresa_telefono2').setValue(this.empresa.empresa_telefono2);
                    this.formEmpresa.get('empresa_telefonoext2').setValue(this.empresa.empresa_telefonoext2);
                    this.formEmpresa.get('empresa_web').setValue(this.empresa.empresa_web);
                    this.formEmpresa.get('empresa_estado').setValue(this.empresa.empresa_estado);
                }else{
                    this.handler.handlerError(data);
                }
            },
            error=>{
                this.handler.showError();
            }
        );
        
    }


    closeDialog(){
        this.dialogRef.close();
    }

    onSubmitUpdate(){
        if(this.formEmpresa.valid){
            let body = {
                formulario: this.formEmpresa.value
            }
            this.loading.emit(true);
            this.WebApiService.putRequest('/administracion/empresas/'+this.id,body,{})
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

    onSubmit(){
        if(this.formEmpresa.valid){
            let body = {
                formulario: this.formEmpresa.value
            }
            this.loading.emit(true);
            this.WebApiService.postRequest('/administracion/empresas',body,{})
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


    onChange(event){
        let pais, estado;
        switch(event.source.ngControl.name){
            case 'pais_codigo':
                pais = this.formEmpresa.get('pais_codigo').value;
                if(pais != ''){
                    this.formEmpresa.get('estado_codigo').setValue('');
                    this.formEmpresa.get('ciudad_codigo').setValue('');
                    this.loading.emit(true);
                    this.WebApiService.getRequest('/administracion/empresas',{
                        action: 'getEstado',
                        pais
                    })
                    .pipe(finalize(()=>this.loading.emit(false)))
                    .subscribe(
                        data=>{
                            if(data.success){
                               this.estados = data.data;
                            }else{
                                this.handler.handlerError(data);
                            }
                        },
                        error=>{
                            this.handler.showError();
                        }
                    )
                }
            break;
            case 'estado_codigo':
                pais    = this.formEmpresa.get('pais_codigo').value;
                estado  = this.formEmpresa.get('estado_codigo').value;
                if(pais != "" && estado != ""){
                    this.formEmpresa.get('ciudad_codigo').setValue('');
                    this.loading.emit(true);
                    this.WebApiService.getRequest('/administracion/empresas',{
                        action: 'getCiudad',
                        pais,
                        estado
                    })
                    .pipe(finalize(()=>{this.loading.emit(false);}))
                    .subscribe(
                        data=>{
                            if(data.success){
                               this.ciudades = data.data;
                            }else{
                                this.handler.handlerError(data);
                            }
                        },
                        error=>{
                            this.handler.showError();
                        }
                    )
                }
            break;
        }
    }

}