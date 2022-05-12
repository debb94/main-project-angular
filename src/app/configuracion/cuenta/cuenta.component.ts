import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WebApiService } from 'src/app/services/web-api.service';
import { ActivatedRoute } from '@angular/router';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import { EncryptService } from 'src/app/services/encrypt.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {
  public loading:boolean    = false;
  searchResponsive:boolean  = false;
  endpoint:string           = '/configuracion/cuentas';

  // variables 
  info:any                  = null;
  datos:any                 = null;
  usuarioDesde:string       = null;
  usuarioEstado:string      = null;
  persona_id:number			= null;
  filtros:any               = [];
  sexos:any                  = [];
  estadoCivil:any			= [];

  // CAMPO CONTRASEÑA
  hide:boolean            = true;
  hideConfirm:boolean     = true;
  viewPass:boolean        = false;

  // options
  viewSection:string        = null;
  titleSection:string       = "";

  // formulario
  formCuenta:any          = null;
  formInfo:any            = null;

  public maskphone    = '(000) 000 00 00';

  constructor(
    private WebApiService:WebApiService,
    private handler:HandlerAppService,
    private route:ActivatedRoute,
    private Encrypt:EncryptService,
    private _adapter: DateAdapter<any>,
  ){
	  this._adapter.setLocale('us');
  }

  ngOnInit(): void {
    this.initForms();
    this.route.paramMap.subscribe(params=>{
      this.filtros['action'] = (params.get('action') != null) ? params.get('action'):'info';
      this.viewSection = this.filtros['action'];
      switch(this.viewSection){
        case 'info':
          this.titleSection = "Información Personal";
        break;
        case 'cuenta':
          this.titleSection = "Información de cuenta";
        break;
      }
      this.sendRequest();
    })
  }

  sendRequest(){
    this.loading = true;
    this.WebApiService.getRequest(this.endpoint,
      Object.assign({
      },this.filtros)
    )
    .subscribe(
      data=>{
        // console.log(data);
        if(data.success){
          this.datos  = data.data[0];
          this.persona_id = this.datos.persona_id;
          this.getParamsUpdate();
          this.loading = false;
        }else{
          this.handler.handlerError(data);
          this.loading = false;
        }
      },
      error=>{
        this.loading = false;
        this.handler.showError();
      }
    );
  }

  initForms(){
    this.formInfo = new FormGroup({
      persona_nombre1:     		new FormControl('',Validators.required),
      persona_nombre2:     		new FormControl(''),
      persona_apellido1:   		new FormControl('',Validators.required),
      persona_apellido2:   		new FormControl(''),
      persona_email:       		new FormControl('',[Validators.required,Validators.email]),
      persona_telefono:    		new FormControl('',[Validators.required]),
      persona_telefono2:   		new FormControl(''),
      persona_sexo:        		new FormControl(''),
      persona_estadocivil: 		new FormControl(''),
      persona_ocupacion:   		new FormControl(''),
      persona_fechanacimiento: 	new FormControl()
    });
    this.formCuenta = new FormGroup({
      usuario_username:     new FormControl('',[Validators.required,Validators.email]),
      usuario_password:     new FormControl('',[Validators.required, Validators.minLength(8)]),
      usuario_rpassword:    new FormControl('',[Validators.required, Validators.minLength(8)]),
    });
  }

  updateFields(){
    switch(this.viewSection){
      case 'info':
		let fechanacimiento = this.datos.persona_fechanacimiento;
        this.formInfo.get('persona_nombre1').setValue(this.datos.persona_nombre1),
        this.formInfo.get('persona_nombre2').setValue(this.datos.persona_nombre2),
        this.formInfo.get('persona_apellido1').setValue(this.datos.persona_apellido1),
        this.formInfo.get('persona_apellido2').setValue(this.datos.persona_apellido2),
        this.formInfo.get('persona_email').setValue(this.datos.persona_email),
        this.formInfo.get('persona_telefono').setValue(this.datos.persona_telefono),
        this.formInfo.get('persona_telefono2').setValue(this.datos.persona_telefono2),
        this.formInfo.get('persona_sexo').setValue(this.datos.persona_sexo),
        this.formInfo.get('persona_estadocivil').setValue(this.datos.persona_estadocivil),
        this.formInfo.get('persona_ocupacion').setValue(this.datos.persona_ocupacion),
        this.formInfo.get('persona_fechanacimiento').setValue(fechanacimiento)
      break;
      case 'cuenta':
        this.formCuenta.get('usuario_username').setValue(this.datos.usuario_username);
        this.usuarioDesde = this.datos.usuario_fcreacion;
        let fdesde = new Date(this.usuarioDesde);
        this.usuarioDesde = fdesde.getFullYear()+'-'+ (fdesde.getMonth()+1) + '-' + fdesde.getDate();
        this.usuarioEstado = (this.datos.usuario_estado)?'Activo':'Inactivo';
      break;
    }
  }

  getParamsUpdate(){
	switch(this.viewSection){
		case 'info':
			this.loading = true;
			this.WebApiService.getRequest(this.endpoint,{
				action: 'getParamsUpdate'
			})
			.subscribe(
				data=>{
					if(data.success == true){
						let datos = data.data[0];
						this.sexos = this.handler.returnJsonToArray(datos.sexo);
						this.estadoCivil = this.handler.returnJsonToArray(datos.estado_civil);
						this.updateFields();
					}else{
					this.handler.handlerError(data);
					}
				},
				error=>{
					this.handler.showError();
				}
			);
		break;
		case 'cuenta':
			this.updateFields();
		break;
	}
  }

  submitCuenta(){
    if(this.formCuenta.valid){
      if(this.formCuenta.get('usuario_password').value == this.formCuenta.get('usuario_rpassword').value){
        let body = {
          pass: this.Encrypt.encrypt(this.formCuenta.get('usuario_password').value)
        }
        this.WebApiService.postRequest(this.endpoint,body,{
          action: 'change-password'
        })
        .subscribe(
          data=>{
            if(data.success){
              this.handler.showSuccess(data.message);
            }else{
              this.handler.handlerError(data);
            }
          },
          error=>{
            this.handler.showError();
          }
        )
        
      }else{
        this.handler.showError("Las contraseñas no coinciden");
      }
    }else{
      this.handler.showError("Complete la información solicitada");
    }
  }

  submitInfo(){
    if(this.formInfo.valid){
      let body = {
        persona_id:				            this.persona_id,
        persona_nombre2:              this.formInfo.get('persona_nombre2').value,
        persona_apellido2:            this.formInfo.get('persona_nombre2').value,
        persona_telefono:             this.formInfo.get('persona_telefono').value,
        persona_telefono2:            this.formInfo.get('persona_telefono2').value,
        persona_sexo:                 this.formInfo.get('persona_sexo').value,
        persona_estadocivil:          this.formInfo.get('persona_estadocivil').value,
        persona_ocupacion:            this.formInfo.get('persona_ocupacion').value,
		    persona_fechanacimiento:      this.formInfo.get('persona_fechanacimiento').value
      }
      this.WebApiService.postRequest(this.endpoint,body,{
        action: 'change-info'
      })
      .subscribe(
        data=>{
          if(data.success){
            this.handler.showSuccess(data.message);
          }else{
            this.handler.handlerError(data);
          }
        },
        error=>{
          this.handler.showError();
        }
      )
      
    }else{
      this.handler.showError("Complete la información solicitada");
    }
  }

  openSearch(){
    this.searchResponsive = !this.searchResponsive;
  }
}