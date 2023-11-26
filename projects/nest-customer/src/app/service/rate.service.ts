import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

const SERVER_URL = environment.SERVER_URL;

const RATE_API = `${SERVER_URL}/api/nest/rate`;

@Injectable({
  providedIn: 'root'
})
export class RateService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllRates(): Observable<any> {
    return this.http.get(`${RATE_API}/get-all`);
  }

  saveRate(rate: any): Observable<any> {
    return this.http.post(`${RATE_API}/save`, rate);
  }

  updateRate(account: any): Observable<any> {
    return this.http.post(`${RATE_API}/update`, account);
  }

  showRatesByProductId(productId: number): Observable<any> {
    return this.http.get(`${RATE_API}/show-by-productId?productId=${productId}`);
  }

  deleteRate(rateId: number): Observable<any> {
    return this.http.delete(`${RATE_API}/delete/${rateId}`);
  }

  getTopRatedProducts(): Observable<any> {
    return this.http.get(`${RATE_API}/get-top-rated-products`);
  }

}