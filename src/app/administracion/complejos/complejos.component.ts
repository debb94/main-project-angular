import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ComplejoDialog } from 'src/app/dialogs/complejos/complejo.dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complejos',
  templateUrl: './complejos.component.html',
  styleUrls: ['./complejos.component.css']
})
export class ComplejosComponent implements OnInit {
  loading:boolean   = false;
  endpoint:string   = '/administracion/complejos'; // usar '/' al comienzo
  searchResponsive:boolean = false;
  complejos:any     = [];

  // permisos
  component:string  = 'Complejos';
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
          this.complejos = data.data;
          this.loading = false;
        }else{
          this.loading = false;
          this.complejos = [];
          this.generateTable(data.data);
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
    this.displayedColumns = [
      // 'select',
      'view',
      'complejo_id',
      'complejo_nombre',
      'complejo_tipo',
      'empresa_nombrecorto',
      'pais_codigo',
      'estado_codigo',
      'actions'                    
    ];
    this.dataSource           = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort      = this.sort.toArray()[0];
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
      this.complejos.map(item=>{
        if(item.selected==true){
          codigos.push(item.complejo_id);
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
        var dialogRef = this.dialog.open(ComplejoDialog,{
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
        var dialogRef = this.dialog.open(ComplejoDialog,{
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
        var dialogRef = this.dialog.open(ComplejoDialog,{
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
