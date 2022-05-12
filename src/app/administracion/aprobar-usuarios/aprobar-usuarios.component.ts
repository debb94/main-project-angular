import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aprobar-usuarios',
  templateUrl: './aprobar-usuarios.component.html',
  styleUrls: ['./aprobar-usuarios.component.css']
})
export class AprobarUsuariosComponent implements OnInit {
  loading:boolean           = false;
  searchResponsive:boolean  = false;
  endpoint:string           = '/administracion/aprobar-usuarios';
  aprobarUsuarios:any       = [];

   // permisos
   component:string  = 'Aprobar Usuarios';
   permissions:any = null;

  // tabla
  displayedColumns:any  = [];
  dataSource:any        = [];
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();


  constructor(
    private WebApiService:WebApiService,
    private handler:HandlerAppService
  ){}

  ngOnInit(): void{
    this.sendRequest();
    this.permissions = this.handler.permissionsApp;
  }

  sendRequest(){
    this.loading = true;
    this.WebApiService.getRequest(this.endpoint,{
      action: 'aprobar-usuarios'
    })
    .subscribe(
      data=>{
        this.permissions = this.handler.getPermissions(this.component);
        if(data.success){
          this.aprobarUsuarios = data.data;
          this.aprobarUsuarios.map(user =>{
            let fcreacion = new Date(user.aprobarusuario_fcreacion);
            user.aprobarusuario_fcreacion = fcreacion.toLocaleString();
          })
          this.generateTable(this.aprobarUsuarios);
          this.loading = false;
        }else{
          this.loading = false;
          this.aprobarUsuarios = [];
          this.generateTable(this.aprobarUsuarios);
          this.handler.handlerError(data);
        }
      },
      error=>{
        this.loading = false;
        this.handler.showError();
        this.permissions = this.handler.getPermissions(this.component);
      }
    );
  }


  generateTable(data){
    this.displayedColumns = [
      // 'select',
      // 'view',
      'aprobarusuario_id',
      'persona_nombrecompleto',
      'usuario_username',
      'propiedad_nombre',
      'complejo_nombre',
      'aprobarusuario_fcreacion',
      'actions'
    ];
    this.dataSource           = new MatTableDataSource(data);
    this.dataSource.sort      = this.sort.toArray()[0];
    this.dataSource.paginator = this.paginator.toArray()[0];
    let search;
    if(document.contains(document.querySelector('search-input-table'))){
      search = document.querySelector('.search-input-table');
      search.value = "";
    }
  }
  applyFilter(search){
    this.dataSource.filter = search.trim().toLowerCase();
  }


  updateStatus(action,codigo=null){
    let status;
    let url;
    let body;
    let codigos = [];
    let min = true;
    switch(action){
      case 'inactive':
        status = 0;
      break;
      case 'active':
        status = 1;
      break;
    }
    if(codigo == null){ // varias actualizaciones
      this.aprobarUsuarios.map(item=>{
        if(item.selected==true){
          min = false;
          codigos.push(item.aprobarusuario_id);
        }
      });
      body = {
        status,
        codigos
      }
      url = this.endpoint+'/null';
    }else{  // una actualizacion
      body = {
        status
      }
      url = this.endpoint+'/'+codigo;
      min = false;
    }
    if(min){
      Swal.fire({
        title: '',
        text: "Debe seleccionar al menos un registro..",
        icon: 'warning'
      });
    }else{
      Swal.fire({
        title: '',
        text: "Desea ejecutar esta acción?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.loading = true;
          this.WebApiService.putRequest(url,body,{
            action: 'aprobar'
          })
          .subscribe(
            data=>{
              if(data.success){
                this.handler.showSuccess(data.message);
                this.sendRequest();
              }else{
                this.handler.handlerError(data);
                this.loading = false;
              }
            },
            error=>{
              this.handler.showError();
              this.loading = false;
            }
          );
        }
      });

    }
  }

  option(action,codigo=null){

  }

  setOption(action,codigo=null){
    switch(action){
      case 'refresh':
        this.sendRequest();
      break;
      case 'active':
        this.updateStatus('active');
      break;
      case 'inactive':
        this.updateStatus('inactive');
      break;
    }
  }

  openSearch(){
    this.searchResponsive = !this.searchResponsive;
  }
}
