import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagoCondominiosComponent } from './pago-condominios/pago-condominios.component';


const routes: Routes = [
  {
    path: 'pago-condominio',
    component: PagoCondominiosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
