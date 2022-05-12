import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  date:number = new Date().getFullYear();
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    window.addEventListener('scroll',()=>{
      let nav = document.querySelector('#mainNav');
      if(window.scrollY > 200){
        nav.classList.add('navbar-scrolled');
      }else{
        nav.classList.remove('navbar-scrolled');
      }
    })
  }

}
