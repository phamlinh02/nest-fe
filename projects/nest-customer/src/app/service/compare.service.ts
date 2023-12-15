import { Injectable } from '@angular/core';
import { BehaviorSubject,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompareService {
    private comparedProductsSource = new BehaviorSubject<any[]>([]);
    comparedProducts$ = this.comparedProductsSource.asObservable();
  
    // Thêm một Subject để thông báo về sự thay đổi
    private comparedProductsChangedSource = new Subject<void>();
    comparedProductsChanged$ = this.comparedProductsChangedSource.asObservable();
  
    updateComparedProducts(products: any[]) {
      this.comparedProductsSource.next(products);
      // Thông báo về sự thay đổi khi cập nhật danh sách sản phẩm so sánh
      this.comparedProductsChangedSource.next();
    }
}