import {AfterViewInit, Component} from '@angular/core';

declare let template: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'nest-admin';

  ngAfterViewInit() {
    template.init();
  }
}
