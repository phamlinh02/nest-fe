import {Component, Input} from '@angular/core';

@Component({
  selector: 'loading-page',
  templateUrl: './loading-page.component.html',
})
export class LoadingPageComponent {
  @Input() isLoading = false;
  title = 'nest-customer';
}
