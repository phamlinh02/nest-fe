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

  getAllProducts(page: number, size: number): Observable<any[]> {
    return this.http.get<any[]>(`${PRODUCT_API}/get-all?page=${page}&size=${size}`);
  }

  getAllProductsIsActive(page: number, size: number): Observable<any[]> {
    return this.http.get<any[]>(`${PRODUCT_API}/get-all-active?page=${page}&size=${size}`);
  }

  getStatisticProduct(): Observable<any[]> {
    return this.http.get<any[]>(`${PRODUCT_API}/statistic-product`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${PRODUCT_API}/get-product?id=${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${PRODUCT_API}/save`,product);
  }

  updateProduct(product: any): Observable<any> {
    return this.http.post(`${PRODUCT_API}/update`, product);
  }

  searchProductsByName(productName: string): Observable<any> {
    return this.http.get(`${PRODUCT_API}/search-by-name?productName=${productName}`);
  }

  showProductsByCategory(categoryId: number): Observable<any> {
    return this.http.get(`${PRODUCT_API}/show-by-category?categoryId=${categoryId}`);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.post(`${PRODUCT_API}/update-status`, { id: productId, isActive: false });
  }
}