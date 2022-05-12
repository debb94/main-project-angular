import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebApiService } from 'src/app/services/web-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KaysenComponent } from 'src/app/kaysen/kaysen.component';
import { EncryptService } from 'src/app/services/encrypt.service';
import { config } from './../../data-config';
import Swal from 'sweetalert2';
import { HandlerAppService } from 'src/app/services/handler-app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loading:boolean  = false;
  endpoint:string   = '/register';

  // variables
  cuser:any;
  keyRecovery:string = "";
  formLogin:FormGroup;
  formRegister:FormGroup;
  formForgotPass:FormGroup;
  formRecovery:FormGroup;

  viewMessage:boolean         = false;
  viewMessageRegister:boolean = false;
  viewMessageForget:boolean   = false;
  viewMessageRecovery:boolean   = false;
  messageRegister:string      = "";
  view:string                 = "login";
  maskPhone:string            = config.maskPhone;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private WebApiService:WebApiService,
    private Encrypt:EncryptService,
    private handler:HandlerAppService,
    public kaysen:KaysenComponent,
  ){}

  ngOnInit(): void {
    this.checkSession();
    // si recibo como parametro recuperar contraseña.
    this.route.queryParamMap.subscribe(params=>{
      this.keyRecovery = (params.get('reset-password'))?params.get('reset-password'):"";
      if(this.keyRecovery!= ""){
        this.view = 'recovery';
        this.initForm('recovery');
      }else{
        this.initForm(this.view);
      }
    });
  }

  checkSession(){
    // ejecutar consulta al servidor para verificar si el token es valido aun...
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.cuser!= null){
      this.WebApiService.token = this.cuser.token;
      if(this.cuser.user != null && this.cuser.token != null && this.cuser.username != null){
        this.router.navigate(['/home']);
      }
    }
  }

  initForm(type:string){
    console.log(type);
    switch(type){
      case 'login':
        this.formLogin = new FormGroup({
          fuser:      new FormControl('', [Validators.required, Validators.email]),
          fpass:      new FormControl('', Validators.required)
        });
      break;
      case 'register':
        this.formRegister = new FormGroup({
          persona_nombre1:        new FormControl('', [Validators.required,Validators.minLength(2)]),
          persona_nombre2:        new FormControl(''),
          persona_apellido1:      new FormControl('', [Validators.required, Validators.minLength(2)]),
          persona_apellido2:      new FormControl('',),
          persona_telefono:      new FormControl('', [Validators.required]),
          usuario_username:      new FormControl('', [Validators.required, Validators.email,Validators.minLength(8)]),
          usuario_password:      new FormControl('', [Validators.required,Validators.minLength(8)]),
          usuario_password2:      new FormControl('', [Validators.required])
        });
      break;
      case 'forgotPass':
        this.formForgotPass = new FormGroup({
          fcorreo:      new FormControl('', [Validators.required, Validators.email])
        });
      break;
      case 'recovery':
        this.formRecovery = new FormGroup({
          fpass:        new FormControl('', [Validators.required, Validators.minLength(8)]),
          fcpass:       new FormControl('', [Validators.required, Validators.minLength(8)])
        });
      break;
    }
  }

  signin(){
    if(this.formLogin.valid){
      let body = {
        fuser:  this.formLogin.get('fuser').value.toLowerCase(),
        fpass:  this.Encrypt.encrypt(this.formLogin.get('fpass').value)
      }
      this.loading = true;
      this.WebApiService.postRequest('/login',body,{
      })
      .subscribe(
        data=>{
          if(data.success == true){
            // seteo localstorage.
            let objData = {
              token: data.token,
              user: data.user,
              username: data.username,
              action: data.action
            }
            localStorage.setItem('currentUser',JSON.stringify(objData));
            localStorage.setItem('isLogged','true');
            this.WebApiService.token = data.token;
            this.kaysen.isLogged = true;
            this.router.navigate(['/home']);
          }else{
            this.loading = false;
            this.kaysen.isLogged = false;
            this.handler.handlerError(data);  
          }
        },
        error=>{
          this.handler.showError();
          this.loading = false;
          this.kaysen.isLogged = false;
        }
      )
    }else{
      this.viewMessage = true;
    }
  }

  register(){
    if(this.formRegister.valid){
      // VALIDACION Y ARREGLO DE NOMBRES
      let nombre1 = this.formRegister.get('persona_nombre1').value.trim();
      let nombre2 = this.formRegister.get('persona_nombre2').value.trim();
      let apellido1 = this.formRegister.get('persona_apellido1').value.trim();
      let apellido2 = this.formRegister.get('persona_apellido2').value.trim();

      nombre1 = nombre1.substr(0,1).toUpperCase() + nombre1.substr(1).toLowerCase();
      if(nombre2.length > 0){
        nombre2 = nombre2.substr(0,1).toUpperCase() + nombre2.substr(1).toLowerCase();
      }
      apellido1 = apellido1.substr(0,1).toUpperCase() + apellido1.substr(1).toLowerCase();
      if(apellido2.length > 0){
        apellido2 = apellido2.substr(0,1).toUpperCase() + apellido2.substr(1).toLowerCase();
      }
      // VALIDACION CONTRASEÑAS
      if(this.formRegister.get('usuario_password').value.length >=8){
        this.viewMessageRegister = false;
      }
      if(this.formRegister.get('usuario_password').value != this.formRegister.get('usuario_password2').value){
        this.messageRegister = "Contraseñas no coinciden.";
        this.viewMessageRegister = true;
        return false;
      }
      let body = {
        persona_nombre1: nombre1,
        persona_nombre2: nombre2,
        persona_apellido1: apellido1,
        persona_apellido2: apellido2,
        persona_telefono: this.formRegister.get('persona_telefono').value,
        usuario_username:  this.formRegister.get('usuario_username').value.trim().toLowerCase(),
        usuario_password: this.Encrypt.encrypt(this.formRegister.get('usuario_password').value),
        usuario_password2: this.Encrypt.encrypt(this.formRegister.get('usuario_password2').value)
      }
      this.postRegister(body);
    }else{
      // agrego mensaje
      if(this.formRegister.get('usuario_password').value.length<8){
        this.messageRegister = "La contraseña debe tener mínimo 8 caracteres";
      }else{
        this.messageRegister = "Completa la información correctamente.";
      }
      this.viewMessageRegister = true;
    }
  }

  forgotPass(){
    if(this.formForgotPass.valid){
      let body = {
        fcorreo: this.formForgotPass.get('fcorreo').value.trim().toLowerCase()
      }
      this.WebApiService.postRequest('/forgot-password',body,{
        action: 'request-password-change'
      })
      .subscribe(
        data=>{
          if(data.success){
            this.handler.showSuccess(data.message);
            this.changeView('login');
          }else{
            this.handler.handlerError(data);
          }
        },
        error=>{
          this.handler.showError();
        }
      );
    }else{
      this.handler.showError('completa la informacion necesaria');
    }
    
  }

  sendRecovery(){
    if(this.formRecovery.valid){
      if(this.formRecovery.get('fpass').value != this.formRecovery.get('fcpass').value){
        this.viewMessageRecovery = true;
      }else{
        this.viewMessageRecovery = false;
        let body = {
          pass: this.Encrypt.encrypt(this.formRecovery.get('fpass').value),
          keyRecovery: this.keyRecovery
        }
        this.loading = true;
        this.WebApiService.postRequest('/forgot-password',body,{
          action: 'change-password'
        })
        .subscribe(
          data=>{
            if(data.success){
              this.handler.showSuccess(data.message);
              this.changeView('login');
            }else{
              this.handler.handlerError(data);
              this.changeView('forgotPass');
            }
            this.loading = false;
          },
          error=>{
            this.handler.showError();
            this.loading = false;
          }
        )
      }
    }
  }
  
  changeView(type:string){
    event.preventDefault();
    event.stopImmediatePropagation();
    this.initForm(type);
    this.view = type;
    this.viewMessage = false;
    this.viewMessageForget = false;
    this.router.navigate(['/login']);
  }

  postRegister(data){
    this.loading = true;
    this.WebApiService.postRequest(this.endpoint,data,{
    }).subscribe(
    data=>{
      if(data.success){
        this.loading = false;
        this.handler.showSuccess(data.message);
        this.view = "login";
        this.initForm(this.view);
      }else{
        this.handler.handlerError(data);
        this.loading = false;
      }
    },
    error=>{
      this.handler.showError();
      this.loading = false;
    })
  }
}
