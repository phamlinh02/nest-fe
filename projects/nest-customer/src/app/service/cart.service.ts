import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const CART_API = `${SERVER_URL}/api/nest/cart`;

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    getAllCarts(accountId: number): Observable<any[]> {
        return this.http.get<any[]>(`${CART_API}/list?accountId=${accountId}`);
    }

    // addToCart(item: CartComponent): Observable<any> {
    //     return this.http.post(${CART_API}/add, item, this.httpOptions);
    // }

    //   updateProduct(productData: any): Observable<any> {
    //     return this.http.post(${API_URL}/nest/product/update, productData, this.httpOptions);
    //   }

    // searchProductsByName(productName: string): Observable<any> {
    //     return this.http.get(${PRODUCT_API}/search-by-name?productName=${productName});
    // }

    // showProductsByCategory(categoryId: number): Observable<any> {
    //     return this.http.get(${PRODUCT_API}/show-by-category?categoryId=${categoryId});
    // }
}