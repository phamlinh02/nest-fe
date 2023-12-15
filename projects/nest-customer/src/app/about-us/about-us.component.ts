import { AfterViewInit,Component } from '@angular/core';
import { Router } from '@angular/router';
import { paths } from '../const';

declare const template: any;
declare const $: any;

@Component({
  selector: 'about-us',
  templateUrl: './about-us.component.html',
})
export class AboutUsComponent implements AfterViewInit {
  title = 'nest-customer';
  paths = paths;

  ngAfterViewInit(): void {  
    $(document).ready(() => {
      template.init();
    });
  }
}
