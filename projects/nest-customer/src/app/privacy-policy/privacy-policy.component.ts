import { Component } from '@angular/core';
import { paths } from '../const';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
})
export class PrivacyPolicyComponent {
  title = 'nest-customer';
  paths = paths;
}
