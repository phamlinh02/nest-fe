import { Component, OnInit } from '@angular/core';
import { paths } from '../const';

declare let template: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit{
  title = 'nest-customer';
  paths = paths;

  ngOnInit(): void {
    template.init();
  }
}
