import { AfterViewInit,Component } from '@angular/core';
import { paths } from '../const';


declare let template: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent  implements AfterViewInit{
  title = 'nest-customer';
  paths = paths;

  ngAfterViewInit(): void {
    template.init();
  }


}
