import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { WebApiService } from '../services/web-api.service';

@Component({
  selector: 'app-kaysen',
  templateUrl: './kaysen.component.html',
  styleUrls: ['./kaysen.component.css']
})
export class KaysenComponent implements OnInit {
  loading:boolean       = false;
  isLogged:boolean      = false;       // usuario conectado
  collapseMenu:boolean  = false;   // apertura y cierre de menu (false - abierto)
  cuser:any;
  responsive:boolean;

  // formulario de soporte
  showSupport:boolean = false;
  formSupport:FormGroup;

  constructor(
    public router:Router,
    public route:ActivatedRoute,
    private WebApiService:WebApiService,
  ){}

  ngOnInit(): void {
    let width = window.innerWidth;
    if(width < 768){
      this.collapseMenu = true;
    }else{
      this.collapseMenu = false;
    }
    this.checkSession();
    this.initForm();
  }
  
  checkSession(){
    // ejecutar consulta al servidor para verificar si el token es valido aun...
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.cuser!= null){
      this.WebApiService.token = this.cuser.token;
      if(this.cuser.user != null && this.cuser.token != null && this.cuser.username != null){
        let route = window.location.pathname;
        if(route == "/"){
          this.router.navigate(['home']);
        }else{
          this.router.navigate([route]);
        }
        this.isLogged = true;
      }else{
        this.isLogged = false;
        this.router.navigate(['/login']);
      }
    }else{
      this.isLogged = false;
      let search;
      let filter = {};
      if(window.location.search != ""){
        search = window.location.search.replace('?','');
        search = search.split('&');
        search.forEach(element => {
          let aux = element.split('=');
          filter[aux[0]] = aux[1];
        });
        this.router.navigate(['/login'],{queryParams:filter});
      }else{
        // nuevo
        let route = window.location.pathname;
        if(route == "/" || route== "/inicio"){
          route = '/inicio';
        }else{
          route = '/login';
        }
        this.router.navigate([route]);
        // /nuevo
        
        // this.router.navigate(['/login']);
      }
      // this.router.navigate(['/login']);
    }
  }

  closeSession(){
    this.isLogged = false;
    this.cuser =  null;
    localStorage.removeItem('isLogged');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  toggleMenu(){
    this.collapseMenu = !this.collapseMenu;
  }


  // RESPONSIVE
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let width = event.target.innerWidth;
    if(width > 1200){
      this.collapseMenu = false;
      this.responsive = false;
    }else if(width > 768 && width <= 1200){
      this.collapseMenu = false;
      this.responsive = false;
    }else{
      this.collapseMenu = true;
      this.responsive = true;
    }
  }

  initForm(){
    this.formSupport = new FormGroup({
      name:     new FormControl('', [Validators.required]),
      phone:    new FormControl('', [Validators.required]),
      mail:     new FormControl('', [Validators.required]),
      message:  new FormControl('', [Validators.required])
    });
  }
  sendMessage(){
    if(this.formSupport.valid){
      let body = {
        formulario: this.formSupport.value
      }
      this.loading = true;
      this.WebApiService.postRequest('/support-message',body,{})
      .subscribe(
        data=>{
          if(data.success){
            Swal.fire({
              title: '',
              text: data.message,
              icon: 'success'
            });
            this.showSupport = false;
            this.loading = false;
          }else{            
            Swal.fire({
              title: '',
              text: data.message,
              icon: 'warning'
            });
            this.showSupport = true;
            this.loading = false;
          }
        },
        error=>{
          // this.handler.showError();
          Swal.fire({
            title: '',
            text: "Se produjo un error",
            icon: 'warning'
          });
          this.loading = false;
          this.showSupport = true;
        }
      );
    }else{
      Swal.fire({
        title: '',
        text: 'Complete la información necesaria',
        icon: 'warning'
      });
    }
    
  }
}
