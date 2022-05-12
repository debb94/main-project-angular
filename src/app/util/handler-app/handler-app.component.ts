import { Component, OnInit, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { KaysenComponent } from 'src/app/kaysen/kaysen.component';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-handler-app',
  templateUrl: './handler-app.component.html',
  styleUrls: ['./handler-app.component.css']
})
export class HandlerAppComponent implements OnInit {

  constructor(
    private router:Router,
    private kaysen:KaysenComponent
  ){ }

  ngOnInit(): void {
  }

  // check application
  handlerError(data:any){
    if(data.action == 'closeSession'){
      Swal.fire({
        title:'',
        text: data.message,
        icon: null
      });
      this.closeSession();
    }else{
      Swal.fire({
        title:'',
        text: data.message,
        icon: null
      });
    }
  }
  // checkPermission
  checkPermisssion(){
    console.log('permisos');
  }

  closeSession(){
    this.kaysen.isLogged  = false;
    this.kaysen.cuser     = null;
    localStorage.removeItem('isLogged');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
    // this.router.navigate(['/login']);
  }

}
