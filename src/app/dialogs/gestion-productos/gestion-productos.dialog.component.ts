import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import {config} from './../../data-config';

@Component({
    selector: 'gestion-productos-dialog',
    templateUrl: 'gestion-productos.dialog.html',
})

export class GestionProductosDialog{
    //variables
    view:string         =null;      // me indica la vista a mostrar
    producto:any        =[];       // data del complejo que estoy detallando.
    title:string        =null;
    id:number           =null;      // registro a consultar.
    endpoint:string     = '/productos/gestion-productos';

    productoRecurrente:boolean = false;
    maskMoney = config.maskMoney;
    
    valorProducto:number = null;
    valorImpuesto:number = null;
    valorProductoBoolean:boolean = false;
    valorProductoTotal:number = 0;

    // update
    formProducto:any;
    complejos:any   =[];


    // OUTPUTS
    @Output() loading    = new EventEmitter();
    @Output() reload     = new EventEmitter();

    constructor(
        public dialogRef: MatDialogRef<GestionProductosDialog>,
        private WebApiService:WebApiService,
        private handler:HandlerAppService,
        @Inject(MAT_DIALOG_DATA) public data
    ){
        this.view = this.data.window;
        this.id = null;
        switch(this.view){
            case 'view':
                this.id         = this.data.codigo;
                this.title      = "Prodcuto #"+this.id;
                this.loading.emit(true);
                this.WebApiService.getRequest(this.endpoint+'/'+this.id,{})
                .subscribe(
                    data=>{
                        if(data.success){
                            this.producto = data.data[0];
                            this.producto.producto_valor = (parseFloat(this.producto.producto_valor)*parseFloat(this.producto.producto_impuesto)/100) +parseFloat(this.producto.producto_valor);
                            this.title += " - "+this.producto.producto_nombre;
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
            break;
            case 'update':
                this.initForms();
                this.id          = this.data.codigo;
                this.title  = "Edición de producto #"+this.id;
            break;
            case 'create':
                this.initForms();
                this.title = "Crear Producto";
            break;
        }
    }

    initForms(){
        this.getDataInit();
        this.formProducto = new FormGroup({
            producto_nombre:            new FormControl('',[Validators.required]),
            producto_valor:             new FormControl('',[Validators.required]),
            producto_impuesto:          new FormControl('',[Validators.required]),
            producto_recurrente:        new FormControl('',[Validators.required]),
            complejo_id:                new FormControl('',[Validators.required]),
            producto_descripcioncorta:  new FormControl('',[Validators.required]),
            producto_descripcion:       new FormControl('')
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
                    this.complejos  = this.handler.returnJsonToArray(datos.complejos);
                    
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
        this.WebApiService.getRequest(this.endpoint+'/'+this.id,{})
        .subscribe(
            data=>{
                this.producto = data.data[0];
                this.formProducto.get('producto_nombre').setValue(this.producto.producto_nombre);
                this.formProducto.get('producto_valor').setValue(this.producto.producto_valor);
                this.formProducto.get('producto_impuesto').setValue(this.producto.producto_impuesto);
                this.valorProducto = this.producto.producto_valor;
                this.valorImpuesto = this.producto.producto_impuesto;
                this.calculateProductValue();
                this.formProducto.get('producto_recurrente').setValue(this.producto.producto_recurrente);
                this.formProducto.get('complejo_id').setValue(this.producto.complejo_id);
                this.formProducto.get('producto_descripcion').setValue(this.producto.producto_descripcion);
                this.formProducto.get('producto_descripcioncorta').setValue(this.producto.producto_descripcioncorta);
                this.loading.emit(false);
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
        this.formProducto.get('producto_recurrente').setValue((this.productoRecurrente?1:0));
        if(this.formProducto.valid){
            let body = {
                formulario: this.formProducto.value
                // formulario: {
                //     propiedad_id: this.formProducto.get('propiedad_id').value,
                //     producto_nombre: this.formProducto.get('producto_nombre').value,
                //     producto_estado: this.formProducto.get('producto_estado').value
                // }
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
    }

    onSubmit(){
        this.formProducto.get('producto_recurrente').setValue((this.productoRecurrente?1:0));
        if(this.formProducto.valid){
            let body = {
                formulario: this.formProducto.value
                // formulario: {
                //     propiedad_id: this.formProducto.get('propiedad_id').value,
                //     producto_nombre: this.formProducto.get('producto_nombre').value,
                //     producto_estado: this.formProducto.get('producto_estado').value
                // }
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
    }
    
    onChange(event){
        switch(event.source.ngControl.name){
            // case 'complejo_id':
            //     this.formProducto.get('edificio_id').setValue('');
            //     this.formProducto.get('propiedad_id').setValue('');
            //     this.loading.emit(true);
            //     this.WebApiService.getRequest(this.endpoint,{
            //         action: 'getEdificios',
            //         complejo_id: this.formProducto.get('complejo_id').value
            //     })
            //     .subscribe(
            //         data=>{
            //             if(data.success){
            //                 this.edificios = data.data;
            //                 this.getPropiedades()
            //                 .then(datapro=>{
            //                     let dato;
            //                     dato = datapro;
            //                     if(dato.success){
            //                         this.propiedades = dato.data;
            //                     }else{
            //                         this.handler.handlerError(dato);
            //                     }
            //                     this.loading.emit(false);
            //                 })
            //                 .catch(error=>{
            //                     this.handler.showError('Se produjo un error');
            //                     this.loading.emit(false);
            //                 })
            //             }else{
            //                 this.edificios = [];
            //                 this.handler.handlerError(data);
            //                 this.getPropiedades()
            //                 .then(datapro=>{
            //                     let dato;
            //                     dato = data;
            //                     if(dato.success){
            //                         this.propiedades = dato.data;
            //                     }else{
            //                         this.handler.handlerError(dato);
            //                     }
            //                     this.loading.emit(false);
            //                 })
            //                 .catch(error=>{
            //                     this.handler.showError('Se produjo un error');
            //                     this.loading.emit(false);
            //                 })
            //             }
            //             // this.loading.emit(false);
            //         },
            //         error=>{
            //             this.handler.showError('Se produjo un error');
            //             this.loading.emit(false);
            //         }
            //     );
            //     /* this.WebApiService.getRequest(this.endpoint,{
            //         action: 'getPropiedades',
            //         complejo_id: this.formProducto.get('complejo_id').value,
            //         edificio_id: this.formProducto.get('edificio_id').value
            //     })
            //     .subscribe(
            //         data=>{
            //             if(data.success){
            //                this.propiedades = data.data;
            //             }else{
            //                 this.handler.handlerError(data);
            //             }
            //             this.loading.emit(false);
            //         },
            //         error=>{
            //             this.handler.showError('Se produjo un error');
            //             this.loading.emit(false);
            //         }
            //     ); */
            // break;
        }
    }

    recurrente(){
        this.productoRecurrente = !this.productoRecurrente;
    }

    calculateProductValue(){
        if(!isNaN(this.formProducto.get('producto_valor').value) && !isNaN(this.formProducto.get('producto_impuesto').value)){
            this.valorProducto = (this.formProducto.get('producto_valor').value != '') ? parseFloat(this.formProducto.get('producto_valor').value) : 0;
            this.valorImpuesto = (this.formProducto.get('producto_impuesto').value != '') ? parseFloat(this.formProducto.get('producto_impuesto').value) : 0;
            
            if(this.valorProducto !== 0 && this.valorImpuesto !==0){
                this.valorProductoTotal = ((this.valorImpuesto * this.valorProducto)/100) + this.valorProducto;
                this.valorProductoBoolean = true;
            }else{
                this.valorProductoBoolean = false;
            }
        }else{
            this.valorProductoBoolean = false;
        }
    }

}