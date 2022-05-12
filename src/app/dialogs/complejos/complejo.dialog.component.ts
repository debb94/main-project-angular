import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import { finalize } from 'rxjs/internal/operators/finalize';



@Component({
    selector: 'complejo-dialog',
    templateUrl: 'complejo.dialog.html',
})

export class ComplejoDialog{
    endpoint:string     = '/administracion/complejos';
    //variables
    view:string         =null;     // me indica la vista a mostrar
    complejo:any        =[]; // data del complejo que estoy detallando.
    title:string        =null;
    id:number           =null; // registro a consultar.

    // update
    formComplejo:any;
    empresas:any    =[];
    paises:any      =[];
    estados:any     =[];
    ciudades:any    =[];
    tipoComplejos:any=[];
    status:any      =[
        {codigo:'',nombre:'Seleccione..'},
        {codigo:1,nombre:'Activo'},
        {codigo:0,nombre:'Inactivo'}
    ];


    // OUTPUTS
    @Output() loading    = new EventEmitter();
    @Output() reload     = new EventEmitter();

    constructor(
        public dialogRef: MatDialogRef<ComplejoDialog>,
        private WebApiService:WebApiService,
        private handler:HandlerAppService,
        @Inject(MAT_DIALOG_DATA) public data
    ){
        this.view = this.data.window;
        this.id = null;
        switch(this.view){
            case 'view':
                this.id          = this.data.codigo;
                this.title  ="Complejo #"+this.id;
                this.WebApiService.getRequest(this.endpoint+'/'+this.id,{})
                .pipe(finalize(()=>{this.loading.emit(false)}))
                .subscribe(
                    data=>{
                        if(data.success){
                            this.complejo = data.data[0];
                            this.title      = "Complejo: "+ this.complejo.complejo_nombre;
                        }else{
                            this.handler.handlerError(data);
                            this.closeDialog();
                        }
                    },
                    error=>{
                        this.handler.showError();
                    }
                );
            break;
            case 'update':
                this.initForms();
                this.id          = this.data.codigo;
                this.title  = "Edición de complejo #"+this.id;
            break;
            case 'create':
                this.initForms();
                this.title = "Crear complejo";
            break;
        }
    }

    initForms(){
        this.getDataInit();
        this.formComplejo = new FormGroup({
            nombre:         new FormControl('',[Validators.required]),
            complejo_tipo:  new FormControl('',Validators.required),
            empresa:        new FormControl('',[Validators.required]),
            pais:           new FormControl('',[Validators.required]),
            estado:         new FormControl('',[Validators.required]),
            ciudad:         new FormControl('',[Validators.required]),
            status:         new FormControl('',[Validators.required])
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
                    this.empresas       = this.handler.returnJsonToArray(datos.empresas);
                    this.tipoComplejos  = this.handler.returnJsonToArray(datos.tipo_complejo);

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
                this.handler.showError();
            }
        );
    }

    getDataUpdate(){
        let dependencies = JSON.stringify(['estados','ciudades']);
        this.WebApiService.getRequest(this.endpoint+'/'+this.id,{
            dependencies
        })
        .subscribe(
            data=>{
                if(data.success){
                    this.complejo = data.data[0];
                    this.title = "Edición de complejo "+this.complejo.nombre;
                    this.formComplejo.get('nombre').setValue(this.complejo.nombre);
                    this.formComplejo.get('complejo_tipo').setValue(this.complejo.complejo_tipo);
                    this.formComplejo.get('empresa').setValue(this.complejo.empresa_id);
                    this.formComplejo.get('pais').setValue(this.complejo.pais_codigo);
                    //dependencies
                    this.estados    = data.estados;
                    this.ciudades   = data.ciudades;
                    /* this.estados.push({
                        codigo: this.complejo.estado_codigo,
                        nombre: this.complejo.estado
                    });
                    this.ciudades.push({
                        codigo: this.complejo.ciudad_codigo,
                        nombre: this.complejo.ciudad
                    }); */
                    this.formComplejo.get('estado').setValue(this.complejo.estado_codigo);
                    this.formComplejo.get('ciudad').setValue(this.complejo.ciudad_codigo);
                    this.formComplejo.get('status').setValue(this.complejo.status);
                    this.loading.emit(false);
                }else{
                    this.handler.handlerError(data);
                    this.closeDialog();
                    this.loading.emit(false);
                }
            },
            error=>{
                this.handler.showError();
                this.loading.emit(false);
            }
        );   
    }


    closeDialog(){
        this.dialogRef.close();
    }

    onSubmitUpdate(){
        if(this.formComplejo.valid){
            let body = {
                formulario: this.formComplejo.value
            }
            this.loading.emit(true);
            this.WebApiService.putRequest(this.endpoint+'/'+this.id,body,{})
            .subscribe(
                data=>{
                    if(data.success){
                        this.handler.showSuccess(data.message);
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
            this.handler.showError('Ingrese la información solicitada');
        }
    }

    onSubmit(){
        if(this.formComplejo.valid){
            let body = {
                formulario: this.formComplejo.value
            }
            this.loading.emit(true);
            this.WebApiService.postRequest(this.endpoint,body,{})
            .subscribe(
                data=>{
                    if(data.success){
                        this.handler.showSuccess(data.message);
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
            this.handler.showError('Ingrese la información solicitada');
        }
    }


    onChange(event){
        let pais, estado;
        switch(event.source.ngControl.name){
            case 'pais':
                pais = this.formComplejo.get('pais').value;

                this.formComplejo.get('estado').setValue('');
                this.formComplejo.get('ciudad').setValue('');
                
                if(pais != ''){
                    this.loading.emit(true);
                    this.WebApiService.getRequest(this.endpoint,{
                        action: 'getState',
                        pais: this.formComplejo.get('pais').value
                    })
                    .pipe(finalize(()=>{this.loading.emit(false);}))
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
            case 'estado':
                this.formComplejo.get('ciudad').setValue('');
                estado = this.formComplejo.get('estado').value;
                if(estado != ''){
                    this.loading.emit(true);
                    this.WebApiService.getRequest(this.endpoint,{
                        action: 'getCities',
                        pais: this.formComplejo.get('pais').value,
                        estado: this.formComplejo.get('estado').value
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