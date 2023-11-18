import {AfterViewInit, Component} from '@angular/core';
import {MessageService} from "primeng/api";
declare const template: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent implements AfterViewInit{
  title = 'nest-customer';

  ngAfterViewInit() {
    // template.init();
  }
}
