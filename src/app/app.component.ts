import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
declare var gtag;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kaysencrmfrontend';

  constructor(
    private route:Router
  ){
    const navEndEvents$ = this.route.events.pipe(
      filter(event=>event instanceof NavigationEnd)
    );

    // navEndEvents$.subscribe((event:NavigationEnd)=>{
    //   gtag('config', 'G-8ZBNS95TCH',{
    //     page_path: event.urlAfterRedirects
    //   });
    // })
  }
}
