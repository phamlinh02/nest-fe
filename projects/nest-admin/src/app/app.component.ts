import {AfterViewInit, Component} from '@angular/core';
import { paths } from './const';

declare let template: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'nest-admin';
  paths = paths;

  ngAfterViewInit() {
  }
}
