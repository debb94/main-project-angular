import { Component, OnInit } from '@angular/core';
import { KaysenComponent } from '../kaysen.component';

@Component({
  selector: 'app-kaysen-encabezado',
  templateUrl: './kaysen-encabezado.component.html',
  styleUrls: ['./kaysen-encabezado.component.css']
})
export class KaysenEncabezadoComponent implements OnInit {
  user:string = "";
  
  constructor(
    private kaysen:KaysenComponent
  ){}

  ngOnInit(): void {
    if(JSON.parse(localStorage.getItem('currentUser'))!= null){
      let cuser = JSON.parse(localStorage.getItem('currentUser'));
      this.user = cuser.user;
    }
    // vincular a proceso de consulta de notificaciones cada 30 seg. e inicialmente.
  }
  
  closeSession(){
    this.kaysen.closeSession();
  }

  toggleMenu(){
    this.kaysen.toggleMenu();
  }
}
