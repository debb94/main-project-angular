import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { KaysenComponent } from '../kaysen/kaysen.component';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HandlerAppService {

  permissions:any;
  permissionsApp = {
      view:   false,
      create: false,
      update: false,
      delete: false,
      report: false,
      addpayment: false,
      paid: false,
  };

  constructor(
    public router:Router,
    private kaysen:KaysenComponent
  ){}

  getPermissions(component:string){
    let permissions = {
      view:   false,
      create: false,
      update: false,
      delete: false,
      report: false,
      addpayment: false,
      paid: false,
    };
    component = component.substring(1);
    if(this.permissions.hasOwnProperty(component)){
      if(this.permissions[component].length > 0){
        this.permissions[component].forEach(permission => {
          switch(permission){
            case 'ver':
              permissions.view = true;
            break;
            case 'crear':
              permissions.create = true;
            break;
            case 'editar':
              permissions.update = true;
            break;
            case 'eliminar':
              permissions.delete = true;
            break;
            case 'addpayment':
              permissions.addpayment = true;
            break;
            case 'paid':
              permissions.paid = true;
            break;
            case 'report':
              permissions.report = true;
            break;
            default:
              console.log('permiso no existe');
            break;
          }
        });
        return permissions;
      }
    }else{
      Swal.fire({
        title: '',
        text: "No tiene permisos para esta acción",
        icon: 'info'
      });
      this.router.navigate(['/home']);
    }
  }

  handlerError(data){
    if(data.hasOwnProperty('action')){
      if(data.action == 'closeSession'){
        Swal.fire({
          title:'',
          text: data.message,
          icon: 'info',
          confirmButtonText: 'OK',
          confirmButtonColor: '#12486f'
        })
        .then(result=>{
          this.closeSession();
        });
      }else{
        if(data.message.length > 0){
          Swal.fire({
            title:'',
            text: data.message,
            icon: null
          });
        }
      }
    }else{
      if(data.message != null){
        if(data.message.length > 0){
          Swal.fire({
            title:'',
            text: data.message,
            icon: null
          });
        }
      }
    }
  }

  showError(message=null){
    if(message== null){
      Swal.fire({
        title: '',
        text: "Se produjo un error",
        icon: 'warning'
      });
    }else{
      Swal.fire({
        title: '',
        text: message,
        icon: 'warning'
      });
    }
  }

  showSuccess(message){
    Swal.fire({
      title: '',
      text: message,
      icon: 'success'
    });
  }

  closeSession(){
    localStorage.removeItem('isLogged');
    localStorage.removeItem('currentUser');
    this.kaysen.isLogged = false;
    this.kaysen.cuser = null;
    window.location.href = '/'
  }

  validateAllFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);            
      if(control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      }else if (control instanceof FormGroup) {        
        this.validateAllFields(control);  
      }
    });
  }

  returnRangeMonths(range:number){
    let start;
    let end;
    let now = new Date();

    let d = new Date(now.getFullYear()+"-"+(now.getMonth()+1)+"-01 00:00");
    start = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    
    d.setMonth(d.getMonth()+range);
    end = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    
    start = new Date(start+" 00:00");
    end = new Date(end+" 00:00");
    return [start,end];
  }

  returnRangeOfPreviousMonths(range:number){
    let start;
    let end;
    let now = new Date();

    let d = new Date(now.getFullYear()+"-"+(now.getMonth()+1)+"-01 00:00");
    start = d.getFullYear()+"-"+(d.getMonth()-range+1)+"-"+d.getDate();
    end = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    
    start = new Date(start+" 00:00");
    end = new Date(end+" 00:00");
    return [start,end];
  }

  returnDateToString(instanceDate){
    let monthString  = (instanceDate.getMonth() < 9)? "0"+(instanceDate.getMonth()+1):""+(instanceDate.getMonth()+1);
    let dateString  = (instanceDate.getDate() < 9)? "0"+(instanceDate.getDate()):""+(instanceDate.getDate());
    return instanceDate.getFullYear()+"-"+monthString+"-"+dateString;
  }

  returnJsonToArray(data:any){
    let variable = JSON.parse(data);
    if(variable!= null && variable!= ""){
      let arrayAux = Array();
      for(let i in variable){
        if(variable[i].toLowerCase() != 'todas' ){
          let cod = i;
          if(isNaN(parseInt(cod))){ // no es un numero
            arrayAux.push({
              codigo:    i,
              nombre:    variable[i]
            })
          }else{
            arrayAux.push({
              codigo:    parseInt(i),
              nombre:    variable[i]
            })
          }
        }
      }
      return arrayAux;
    }
  }

}
