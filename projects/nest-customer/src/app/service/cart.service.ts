import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { CartItem } from './cart-item.model';

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

    removeById(id: number): Observable<any> {
        return this.http.delete<any>(`${CART_API}/removeid?id=${id}`);
    }

    remove(accountId: number): Observable<any[]> {
        return this.http.delete<any[]>(`${CART_API}/remove?accountId=${accountId}`);
    }

    addToCart(accountId: number, productId: number): Observable<any> {
        const item: CartItem = {
            accountId: accountId,
            productId: productId,
            quantity: 1
            // Thông tin khác của sản phẩm
        };
        return this.http.post<any>(`${CART_API}/add`, item, this.httpOptions);
    }

    update(accountId: number, cartItems: CartItem[]): Observable<any> {
        return this.http.put<any>(`${CART_API}/update?accountId=${accountId}`, cartItems, this.httpOptions);
    }

}