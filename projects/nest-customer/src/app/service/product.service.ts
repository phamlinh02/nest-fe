import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const PRODUCT_API = `${SERVER_URL}/api/nest/product`;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(PRODUCT_API + '/get-all-active');
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${PRODUCT_API}/get-product?id=${id}`);
  }
  searchProductsByName(productName: string): Observable<any> {
    return this.http.get(`${PRODUCT_API}/search-by-name?productName=${productName}`);
  }

  showProductsByCategory(categoryId: number): Observable<any> {
    return this.http.get(`${PRODUCT_API}/show-by-category?categoryId=${categoryId}`);
  }

  showProductsByCategoryPage(categoryId: number): Observable<any> {
    return this.http.get(`${PRODUCT_API}/show-by-category?categoryId=${categoryId}`);
  }
}