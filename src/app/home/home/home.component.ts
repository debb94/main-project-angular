import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { Router } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from './../../../../node_modules/chart.js';
import { HandlerAppService } from 'src/app/services/handler-app.service.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  loading:boolean = false;

  // datos superusuario y empresa
  active_customers:number     = 0;
  inactive_customers:number   = 0;
  operations:number           = 0;
  pendingTransactions:number  = 0;
  fee:number                  = 0.00;
  amountTransactions:number   = 0.00;
  pendingAmount:number        = 0.00;

  // grafico
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        ticks: { fontColor: '#6c757d' },
        // gridLines: { color: 'rgba(0,0,0,0.1)' }
        gridLines: { color: '#f7f7f7'}
      }],
      yAxes: [{
        ticks: { fontColor: '#6c757d' },
        // gridLines: { color: 'rgba(0,0,0,0.1)' }
        gridLines: { color: '#f7f7f7'}
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = Array();
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: any[] = [];
  // public barChartData: any[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  // ];


  saldo:number;
  valorPagar:number;
  ultimoPago:string;
  proximoPago:string;
  pendienteMes:number;
  pendienteAnio:number;
  pagadoMes:number;
  pagadoAnio:number;
  feeMensual:number;
  feeAnual:number;
  transacciones:any[] = [];
  viewChangePassword:boolean = false;

  mantenimiento:number;
  txUnica:boolean;
  txId:number;

  productos:number;
  txUnicoProducto:boolean = null;
  txIdProducto:number     = null;

  derrama:number;
  txUnicaDerrama:boolean  = null;
  txIdDerrama:number      = null;

  servicios:number;
  txUnicoServicio:boolean = null;
  txIdServicio:number     = null;

  multas:number;
  txUnicaMulta:boolean    = null;
  txIdMulta:number        = null;

  // userProfile = "admin";
  userProfile:string = "";

  constructor(
    private WebApiService:WebApiService,
    public handler:HandlerAppService,
    public router:Router
  ){ }

  ngOnInit(): void {
    let cuser = JSON.parse(localStorage.getItem('currentUser'));
    if(cuser.hasOwnProperty('action')){
      if(cuser.action =="change-password"){
        this.viewChangePassword = true;
      }
    }
    // this.sendRequest();
    let date = new Date();
    let anno;
    let month;
    // this.proximoPago = date.getFullYear()+'/'+ (date.getMonth() +1)+'/'+date.getDate();
    if(date.getMonth()==11){
      month = '01';
      anno = date.getFullYear()+1;
    }else{
      month = date.getMonth() +2;
      anno = date.getFullYear();
    }
    this.proximoPago = anno +'/'+ month +'/01';
  }
  sendRequest(){
    this.loading = true;
    this.WebApiService.getRequest('/home',{
    })
    .subscribe(
      data=>{
        // console.log(data);
        if(data.success){
          let dato = data.data[0];
          this.userProfile = data.perfil;
          switch(data.perfil){
            case 'admin':
              this.pendienteMes   = (dato.pendiente_mes == null) ? 0.00 : parseFloat(dato.pendiente_mes);
              this.pendienteAnio  = (dato.pendiente_anio == null) ? 0.00 : parseFloat(dato.pendiente_anio);
              this.pagadoMes      = (dato.pagado_mes == null) ? 0.00 : parseFloat(dato.pagado_mes);
              this.pagadoAnio     = (dato.pagado_anio == null) ? 0.00 : parseFloat(dato.pagado_anio);
              this.feeMensual     = (dato.fee_mensual == null) ? 0.00 : parseFloat(dato.fee_mensual);
              this.feeAnual       = (dato.fee_anual == null) ? 0.00 : parseFloat(dato.fee_anual);

              // widgets
              this.active_customers   = dato.active_customers;
              this.inactive_customers = dato.inactive_customers;
              this.operations         = dato.transactions;
              this.fee                = dato.fee;
              this.amountTransactions = dato.amount;
              this.pendingTransactions= dato.pending_transactions;
              // chart
              let chart = data.chart;
              let dataChart = Array();
              for(let i in chart) {
                this.barChartLabels.push(chart[i].month);
                dataChart.push(parseFloat(chart[i].amount_chart));
              }
              // console.log(dataChart);
              // this.barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
              this.barChartData = [
                { 
                  data: dataChart, 
                  label: 'Recaudado',
                  borderWidth: 1,
                  backgroundColor: [
                    '#3398f2','#3398f2','#3398f2','#3398f2','#3398f2','#3398f2','#3398f2'
                  ],
                  borderColor: [
                    '#0963b2','#0963b2','#0963b2','#0963b2','#0963b2','#0963b2','#0963b2'
                  ],
                  hoverBackgroundColor:[
                    '#3398f2','#3398f2','#3398f2','#3398f2','#3398f2','#3398f2','#3398f2'
                  ],
                  hoverBorderColor: [
                    '#0963b2','#0963b2','#0963b2','#0963b2','#0963b2','#0963b2','#0963b2'
                  ]
                }
              ];
            break;
            case 'comun':
/* <<<<<<< HEAD
              let valorMantenimiento =0, valorProductos =0, valorDerramas =0, valorMultas =0;
              let mantenimiento,productos,derramas,multas;

              // mantenimiento
              mantenimiento = JSON.parse(dato.mantenimiento);
              this.txUnica    = 0;
              this.txId       = null;
              mantenimiento.forEach((tx)=>{
                this.txUnica++;
                this.txId           = tx.tx_id;
                valorMantenimiento  += tx.valor;  
              });
              this.mantenimiento  = valorMantenimiento;

              // productos
              productos = JSON.parse(dato.productos);
              this.txUnicaProducto  = 0;
              this.txIdProducto     = null;
              productos.forEach((tx)=>{
                this.txUnicaProducto++;
                this.txIdProducto     = tx.tx_id;
                valorProductos      += tx.valor;  
              });
              this.productos      = valorProductos;

              // derramas
              derramas = JSON.parse(dato.derramas);
              this.txUnicaDerrama   = 0;
              this.txIdDerrama      = null;
              derramas.forEach((tx)=>{
                this.txUnicaDerrama++;
                this.txIdDerrama    = tx.tx_id;
                valorDerramas       += tx.valor;  
              });
              this.derrama        = valorDerramas;

              // multas
              multas = JSON.parse(dato.multas);
              this.txUnicaMulta     = 0;
              this.txIdMulta        = 0;
              multas.forEach((tx)=>{
                this.txUnicaMulta++;
                this.txIdMulta    = tx.tx_id;
                valorMultas       += tx.valor;  
              });
              this.multas         = valorMultas;

======= */
              let valorMantenimiento =0, valorProductos =0, valorDerramas =0, valorMultas =0, valorServicios = 0;
              // Mantenimiento
              let mantenimiento  = JSON.parse(dato.mantenimiento);
              this.txUnica = (mantenimiento.length > 1) ? false : true;
              mantenimiento.forEach(tx =>{
                valorMantenimiento += tx.valor;
                this.txId = tx.tx_id;
              })
              this.mantenimiento = valorMantenimiento;

              // Productos
              let productos = JSON.parse(dato.productos);
              this.txUnicoProducto = (productos.length > 1) ? false : true;
              productos.forEach(tx =>{
                valorProductos += tx.valor;
                this.txIdProducto = tx.tx_id;
              })
              this.productos = valorMantenimiento;

              // Derramas
              let derramas = JSON.parse(dato.derramas);
              this.txUnicaDerrama = (derramas.length > 1) ? false : true;
              derramas.forEach(tx =>{
                valorDerramas += tx.valor;
                this.txIdDerrama = tx.tx_id;
              })
              this.derrama = valorDerramas;

              // Servicios
              let servicios = JSON.parse(dato.servicios);
              this.txUnicoServicio = (servicios.length > 1) ? false : true;
              servicios.forEach(tx =>{
                valorServicios += tx.valor;
                this.txIdServicio = tx.tx_id;
              })
              this.servicios = valorServicios;

              // Multas
              let multas = JSON.parse(dato.multas);
              this.txUnicaMulta = (multas.length > 1) ? false : true;
              multas.forEach(tx =>{
                valorMultas += tx.valor;
                this.txIdMulta = tx.tx_id;
              })
              this.multas = valorMultas;


              
              // this.productos      = dato.productos;
              // this.derrama        = dato.derramas;
              // this.multas         = dato.multas;
// >>>>>>> cf83b1b75a0e18859dd0018e1d60f73189dbedd3
              // this.servicios      = dato.servicios;
              this.saldo          = (dato.tx_saldo == null)? 0.00 : parseFloat(dato.tx_saldo);
              this.valorPagar     = (dato.tx_valortotalpagar == null)? 0.00 : parseFloat(dato.tx_valortotalpagar);
              this.ultimoPago     = (dato.tx_ultimopago == null) ? ' - ' : dato.tx_ultimopago;
              this.transacciones  = JSON.parse(dato.transacciones);
            break;
          }
          this.loading = false;
        }else{
          this.loading = false;
        }
      },
      error=>{
        this.handler.showError();
        this.loading = false;
      }
    )
  }

  changePassword(){
    this.removeAlert();
    this.router.navigate(['/configuracion/cuentas/cuenta']);
  }

  removeAlert(){
    let cuser = JSON.parse(localStorage.getItem('currentUser'));
    delete(cuser.action);
    localStorage.setItem('currentUser',JSON.stringify(cuser));
    this.viewChangePassword = false;
  }

  

  // ngOnInit() {
  //   // Default data set mapping, hardcoded here.
  //   this.chart = anychart.pie(this.dataService_.getData('data1'));
  // }

  ngAfterViewInit(){
    
  }


}
