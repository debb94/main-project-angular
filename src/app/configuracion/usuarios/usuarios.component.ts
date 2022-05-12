import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import swal from 'sweetalert2';
import { HandlerAppService } from 'src/app/services/handler-app.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  loading:boolean           = false;
  endpoint:string           = '/configuracion/usuarios';
  searchResponsive:boolean  = false;
  usuarios:any              = [];

  // permisos
  component:string  = 'Usuarios';
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
    })
    .subscribe(
      data=>{
        this.permissions = this.handler.getPermissions(this.component);
        if(data.success){
          this.generateTable(data.data);
          this.usuarios = data.data;
          this.loading = false;
        }else{
          this.usuarios = [];
          this.loading = false;
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
      'view',
      'usuario_id',
      'usuario_username',
      'nombre',
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


  updateStatus(action,codigo){
    let clientList = [];
    let body;

    this.loading = true;
    console.log(codigo,action);

    if(action == 'activeClient'){
      status = 'A';
    }else{
      status = 'I';
    }
    clientList.push(codigo);
    body = {
      clientes: clientList,
      status
    };
    this.WebApiService.postRequest('/clientes',body,{
      action: 'updateStatusCustommers'
    })
    .subscribe(
      data=>{
        console.log(data);
        this.loading = false;
      },
      error=>{
        this.loading = false;
        console.log(error);
      }
    );
  }

  option(action,codigo=null){

  }

  setOption(action,codigo=null){
    
  }

  openSearch(){
    this.searchResponsive = !this.searchResponsive;
  }
}
