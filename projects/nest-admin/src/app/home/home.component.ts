import {AfterViewInit, Component} from '@angular/core';

declare let template: any;

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    template.init();
  }
  title = 'nest-customer';


}
