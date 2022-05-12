import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import { WebApiService } from 'src/app/services/web-api.service';

@Component({
  selector: 'app-pago-condominios',
  templateUrl: './pago-condominios.component.html',
  styleUrls: ['./pago-condominios.component.css']
})
export class PagoCondominiosComponent implements OnInit {
  loading:boolean         = false;
  pagosWidgets:any        = [];
  transacciones:any       = [];
  endpoint:string         = '/reportes/pago-condominio';
  searchResponsive:boolean = false;
  // permisos
  component:string    = 'Pago Condominio';
  permissions:any     = null;

  // filters
  formFilter:FormGroup;
  complejos:any           = [];
  startDate:string        = "";
  endDate:string          = "";

  // widgets
  mantenimiento           = {total_condominio:0,fee:0,total:0};
  productos               = {total_condominio:0,fee:0,total:0};
  derramas                = {total_condominio:0,fee:0,total:0};
  multas                  = {total_condominio:0,fee:0,total:0};
  
  // tabla
  // displayedColumns:any  = [];
  // dataSource:any        = [];
  // @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  // @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private WebApiService:WebApiService,
    public handler:HandlerAppService,
    private _adapter: DateAdapter<any>,
    // public dialog:MatDialog
  ){
    this._adapter.setLocale('en-US');
  }

  ngOnInit(): void{
    // seteo un mes
    let d = this.handler.returnRangeMonths(1);
    this.startDate = d[0];
    this.endDate = d[1];
    this.initForms();
    this.getFilters();
    this.sendRequest();
    this.permissions = this.handler.permissionsApp;
  }

  sendRequest(){
    this.loading = true;
    let dStart,dEnd;
    dStart  = this.formFilter.get('dStart').value;
    dEnd    = this.formFilter.get('dEnd').value;
    dStart  = dStart.getFullYear()+"-"+(dStart.getMonth()+1)+"-"+dStart.getDate();
    dEnd    = dEnd.getFullYear()+"-"+(dEnd.getMonth()+1)+"-"+dEnd.getDate();
    
    let filters = {
      complejoId:  this.formFilter.get('complejoId').value,
      dStart,
      dEnd
    }
    this.WebApiService.getRequest(this.endpoint,filters)
    .pipe(finalize(()=>{
      this.loading = false; 
      this.permissions = this.handler.getPermissions(this.component);
    }))
    .subscribe(
      data=>{
        if(data.success){
          this.pagosWidgets = data.data;
          this.setData(this.pagosWidgets);
          // this.generateTable(data.data);
          // this.estacionamientos = data.data;
        }else{
          // this.estacionamientos = [];
          // this.generateTable(this.estacionamientos);
          // this.handler.handlerError(data);
        }
      },
      error=>{
        this.handler.showError();
      }
    );
  }

  getReport(){
    let myHeaders = new Headers();
    let dStart, dEnd, monthStart, monthEnd,dateStart, dateEnd;
    myHeaders.append('authorization',this.WebApiService.token);
    this.loading = true;
    
    dStart  = this.formFilter.get('dStart').value;
    dEnd    = this.formFilter.get('dEnd').value;
    monthStart  = (dStart.getMonth() < 10)? "0"+(dStart.getMonth()+1):""+(dStart.getMonth()+1);
    monthEnd    = (dEnd.getMonth() < 10)? "0"+(dEnd.getMonth()+1):""+(dEnd.getMonth()+1);
    dateStart   = (dStart.getDate() < 10)? "0"+(dStart.getDate()+1):""+(dStart.getDate()+1);
    dateEnd     = (dEnd.getDate() < 10)? "0"+(dEnd.getDate()+1):""+(dEnd.getDate()+1);

    dStart  = dStart.getFullYear()+"-"+monthStart+"-"+dateStart;
    dEnd    = dEnd.getFullYear()+"-"+monthEnd+"-"+dateEnd;
    let body = {
      complejoId:  this.formFilter.get('complejoId').value,
      dStart,
      dEnd
    }
    let date = new Date();
    let dateString = date.getFullYear() +'-'+date.getMonth()+'-'+date.getDate();
    fetch(this.WebApiService.urlKaysenBackend + this.endpoint+"?action=getReportExcel", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(body),
      headers:myHeaders
    })
    .then(res =>{return res.blob()})
    .catch(error => {
      console.error('Error:', error)
      this.loading = false;
    })
    .then( response => {
      var objectURL = URL.createObjectURL(response);
      let anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = "listado-propiedades-pagos-"+dateString+".xlsx";
      anchor.target = '_blank';
      anchor.classList.add('noview');
      document.getElementsByTagName('body')[0].appendChild(anchor);
      anchor.click();
      // window.open(objectURL);
      this.loading = false;
    });
  }

  initForms(){
    this.formFilter = new FormGroup({
      complejoId: new FormControl(""),
      dStart: new FormControl(),
      dEnd: new FormControl()
    });
    this.formFilter.get('dStart').setValue(this.startDate);
    this.formFilter.get('dEnd').setValue(this.endDate);
  }

  getFilters(){
    this.WebApiService.getRequest(this.endpoint,{
      action: 'getFilters'
    }).subscribe(
      data=>{
        if(data.success){
          this.complejos = data.data;
        }else{
          this.handler.handlerError(data);
        }
      },
      error=>{
        this.handler.showError();
      }
    )
  }


  setData(data){
    this.mantenimiento      = JSON.parse(data[0].mantenimiento)[0];
    this.mantenimiento      = {total_condominio: this.mantenimiento.total - this.mantenimiento.fee, fee:this.mantenimiento.fee,total: this.mantenimiento.total}
    this.productos          = JSON.parse(data[0].productos)[0];
    this.productos          = {total_condominio: this.productos.total - this.productos.fee, fee:this.productos.fee, total:this.productos.total}
    this.derramas           = JSON.parse(data[0].derramas)[0];
    this.derramas           = {total_condominio: this.derramas.total - this.derramas.fee, fee:this.derramas.fee, total: this.derramas.total}
    this.multas             = JSON.parse(data[0].multas)[0];
    this.multas             = {total_condominio: this.multas.total - this.multas.fee, fee:this.multas.fee, total: this.multas.total}
  }



  generateTable(data){
    /* this.displayedColumns = [
      // 'select',
      'view',
      'estacionamiento_id',
      'estacionamiento_nombre',
      'propiedad_nombre',
      'complejo_nombre',
      'actions'
    ];
    this.dataSource           = new MatTableDataSource(data);
    this.dataSource.sort      = this.sort.toArray()[0];
    this.dataSource.paginator = this.paginator.toArray()[0];
    let search;
    if(document.contains(document.querySelector('search-input-table'))){
      search = document.querySelector('.search-input-table');
      search.value = "";
    } */
  }
  applyFilter(search){
    // this.dataSource.filter = search.trim().toLowerCase();
  }

}
