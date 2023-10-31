import { Component } from '@angular/core';
import { paths} from '../const';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  title = 'nest-customer';
  paths = paths;
}
