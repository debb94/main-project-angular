import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { HandlerAppComponent } from 'src/app/util/handler-app/handler-app.component';
// import { KaysenMenuComponent } from 'src/app/kaysen/kaysen-menu/kaysen-menu.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { EmpresaDialog } from 'src/app/dialogs/empresas/empresa.dialog.component';
import { HandlerAppService } from 'src/app/services/handler-app.service';


@Component({
  selector: 'app-compania',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  loading:boolean   = false;
  endpoint:string   = '/administracion/empresas';
  searchResponsive:boolean = false;
  empresas:any     = [];

  // permisos
  component:string  = 'Empresas';
  permissions:any = null;

  // tabla
  displayedColumns:any  = [];
  dataSource:any        = [];
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private WebApiService:WebApiService,
    public handler:HandlerAppService,
    public dialog:MatDialog
  ){}

  ngOnInit(): void{
    // console.log(this.menu.permisos);
    this.sendRequest();
    this.permissions = this.handler.permissionsApp;
  }

  sendRequest(){
    this.loading = true;
    this.WebApiService.getRequest(this.endpoint,{
    })
    .subscribe(
      data=>{
        this.permissions = this.handler.getPermissions(this.endpoint);
        if(data.success){
          this.generateTable(data.data);
          this.empresas = data.data;
          this.loading = false;
        }else{
          this.empresas = [];
          this.loading = false;
          this.handler.handlerError(data);
        }
      },
      error=>{
        this.loading = false;
        this.handler.showError();
        this.permissions = this.handler.getPermissions(this.endpoint);
      }
    );
  }


  generateTable(data){
    this.permissions = this.handler.getPermissions(this.endpoint);
    this.displayedColumns = [
      // 'select',
      'view',
      'empresa_id',
      'empresa_nombrecorto',
      'empresa_tiporelacion',
      'estado_codigo',
      'empresa_correo',
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
    switch(action){
      case 'inactive':
        status = 0;
      break;
      case 'active':
        status = 1;
      break;
    }
    if(codigo == null){ // varias actualizaciones
      this.empresas.map(item=>{
        if(item.selected==true){
          codigos.push(item.empresa_id);
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
    }

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
        this.WebApiService.putRequest(url,body,{
          action: 'updateStatus'
        })
        .subscribe(
          data=>{
            if(data.success){
              Swal.fire({
                title: '',
                text: data.message,
                icon: 'success'
              });
              this.sendRequest();
            }else{
              this.handler.handlerError(data);
            }
          },
          error=>{
            Swal.fire({
              title: '',
              text: 'Se produjo un error',
              icon: 'warning'
            });
          }
        );
      }
    });
  }

  option(action,codigo=null){
    switch(action){
      case 'view':
        this.loading = true;
        var dialogRef = this.dialog.open(EmpresaDialog,{
          data: {
            window: 'view',
            codigo
          }
        });
        dialogRef.disableClose = true;
        // LOADING
        dialogRef.componentInstance.loading.subscribe(val=>{
          this.loading = val;
        });
        // dialogRef.afterClosed().subscribe(result => {
        //   console.log('The dialog was closed');
        //   console.log(result);
        // });
      break;
      case 'update':
        this.loading = true;
        var dialogRef = this.dialog.open(EmpresaDialog,{
          data: {
            window: 'update',
            codigo
          }
        });
        dialogRef.disableClose = true;
        // LOADING
        dialogRef.componentInstance.loading.subscribe(val=>{
          this.loading = val;
        });
        // RELOAD
        dialogRef.componentInstance.reload.subscribe(val=>{
          this.sendRequest();
        });
      break;
    }

  }
  

  setOption(action,codigo=null){
    switch(action){
      case 'refresh':
        this.sendRequest();
      break;
      case 'create':
        this.loading = true;
        var dialogRef = this.dialog.open(EmpresaDialog,{
          data: {
            window: 'create',
            codigo
          }
        });
        dialogRef.disableClose = true;
        // LOADING
        dialogRef.componentInstance.loading.subscribe(val=>{
          this.loading = val;
        });
        // RELOAD
        dialogRef.componentInstance.reload.subscribe(val=>{
          this.sendRequest();
        });
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