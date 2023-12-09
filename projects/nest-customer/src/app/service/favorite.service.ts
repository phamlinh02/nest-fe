import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,Subject, tap } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const FAVORITE_API = `${SERVER_URL}/api/nest/favorite`;

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  favoriteUpdated: Subject<void> = new Subject<void>();

  updateFavorite() {
    this.favoriteUpdated.next();
}

  getFavoriteProducts(accountId: number): Observable<any> {
    return this.http.get(`${FAVORITE_API}/get-favorite?accountId=${accountId}`);
  }

  addProductToFavorite(favorite: any): Observable<any> {
    return this.http.post(`${FAVORITE_API}/add`, favorite).pipe(
      tap(() => {
        this.updateFavorite();
      })
    );
  }

  removeProductFromFavorite(accountId: number, productId: number): Observable<void> {
    const url = `${FAVORITE_API}/delete/${accountId}/products/${productId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.updateFavorite();
      })
    );
  }
  
}