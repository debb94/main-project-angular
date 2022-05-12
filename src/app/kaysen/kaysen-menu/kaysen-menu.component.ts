import { Component, OnInit, Injectable } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
// import { HandlerAppComponent } from 'src/app/util/handler-app/handler-app.component';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import { KaysenComponent } from '../kaysen.component';

@Component({
  selector: 'app-kaysen-menu',
  templateUrl: './kaysen-menu.component.html',
  styleUrls: ['./kaysen-menu.component.css']
})
export class KaysenMenuComponent implements OnInit {
  menu:any[];
  permissions:any[]  = Array();
  constructor(
    private WebApiService:WebApiService,
    // private handler:HandlerAppComponent
    private handler:HandlerAppService,
    private kaysen:KaysenComponent
  ){}

  ngOnInit(): void {
    this.sendRequest()
  }

  sendRequest(){
    this.WebApiService.postRequest('/menu',{},{})
    .subscribe(
      data=>{
        if(data.success){
          let result    = data.data;
          let menus     = [];
          let padreAux  = "";
          result.forEach(title => {
            if(title.menu_padre != padreAux && title.menu_padre != ''){
              padreAux = title.menu_padre;
              let menusHijos = [];
              result.forEach(hijos=>{
                if(hijos.menu_padre == padreAux && hijos.menu_hijo != ''){
                  menusHijos.push(hijos);
                  let perm = hijos.permisos;
                  perm = perm.split('|');
                  this.permissions[hijos.menu_hijo_accion] = perm;
                }
              });
              // agrego al menu padre los hijos.
              title.hijos = menusHijos;
              menus.push(title);
              // menus['hijos'].push(menusHijos);
            }
          });
          this.menu = menus;
          this.handler.permissions = this.permissions;
        }else{
          this.handler.handlerError(data);
        }
      }
    );
  }

  closeMenu(){
    if(window.innerWidth < 768){
      this.kaysen.toggleMenu();
    }
  }
}
