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
    return this.http.get<any[]>(`${PRODUCT_API}/get-all-active`);
  }

  getAllProductsPage(page: number, size: number): Observable<any[]> {
    return this.http.get<any[]>(`${PRODUCT_API}/get-all-active?page=${page}&size=${size}`);
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

  getRecentlyAddedProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${PRODUCT_API}/get-recently-added`);
  }

  getRecentlyAdded(): Observable<any[]> {
    return this.http.get<any[]>(`${PRODUCT_API}/get-recently`);
  }

  getMostSearchedProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${PRODUCT_API}/get-most-searched-products`);
  }

  getTopRatedProducts(limit: number): Observable<any[]> {
    return this.http.get<any[]>(`${PRODUCT_API}/top-rated-products?limit=${limit}`);
  }
}
