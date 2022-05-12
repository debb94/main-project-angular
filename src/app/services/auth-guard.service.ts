import { Injectable } from '@angular/core';
import {Router,CanActivate} from '@angular/router';
// import { KaysenComponent } from '../kaysen/kaysen.component';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate{

  constructor(
    public router:Router
    // public kaysen:KaysenComponent
  ){}

  canActivate():boolean{
    // console.log(this.router.url);
    // return true;

    if(localStorage.getItem('isLogged') == null && localStorage.getItem('currentUser') == null){
      if(window.location.pathname == "/" || window.location.pathname == '/login'){
        // this.router.navigate(['/login']);
        return true;
      }else{
        // this.router.navigate(['/login']);
        this.router.navigate(['/']);
      }
      // return false;
      // console.log('no conectado');

      // if(window.location.pathname != "/login"){
      //   return false;
      // }
      // this.router.navigate(['/login']);
      // return true;
      // this.router.navigate(['/login']);
      // console.log('no logueado');
      // return true;
    }else{
      return true;
    }

    // if(localStorage.getItem('isLogged') == null && localStorage.getItem('currentUser') == null){
    //   if(this.router.url == '/'){

    //   }else{
    //     Swal.fire({
    //       title:'',
    //       text:'Debe iniciar sesion',
    //       icon: null
    //     });
    //   }
    //   // this.router.navigate(['/login']);
    //   return true;
    // }else{
    //   return true;
    // }

    // this.router.navigate(['/']);
    // Swal.fire({
    //   title:'',
    //   text:'Debe iniciar sesion',
    //   icon: null
    // })
    // if(localStorage.getItem('isLogged') == 'true' && localStorage.getItem('currentUser')){
    //   Swal.fire({
    //     title:'',
    //     text:'Debe iniciar sesion',
    //     icon: null
    //   });
    // }
    // Swal.fire({
    //   title:'',
    //   text:'Debe iniciar sesion',
    //   icon: null
    // });
    // this.router.navigate(['/login']);
    // return true;
    // return true;
    // if(localStorage.getItem('isLogged') == 'true' && localStorage.getItem('currentUser')){
    //   Swal.fire({
    //     title:'',
    //     text:'Debe iniciar sesion',
    //     icon: null
    //   })
    //   console.log('aca');
      
    //   this.kaysen.isLogged = true;
    //   this.router.navigate(['/home']);
    //   return true;
    // }else{
    //   Swal.fire({
    //     title:'',
    //     text:'Debe iniciar sesion',
    //     icon: null
    //   })
    //   this.kaysen.isLogged = false;
    //   this.router.navigate(['/login']);
    //   return false;
    // }
  }
}
