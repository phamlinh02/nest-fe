import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../enviroment/enviroment";

const SERVER_URL = environment.SERVER_URL;

const ORDER_API = `${SERVER_URL}/api/nest/order`;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
  }),
};

@Injectable({providedIn: 'root'})
export class OrderService {

  constructor(private http: HttpClient) {
  }

  getAllOrder(order: any): Observable<any> {
    return this.http.post(ORDER_API + '/get-all', order, httpOptions)
  }

  getBillDetail(id: number): Observable<any> {
    return this.http.get(ORDER_API + `/get-detail/${id}`, httpOptions)
  }

  createBill(request: any): Observable<any> {
    return this.http.post(ORDER_API + `/create-bill`,request, httpOptions)
  }

  getTopSellingProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${ORDER_API}/selling`);
  }

  updateTransaction(request: any): Observable<any> {
    return this.http.post(ORDER_API + `/transaction-success`,request, httpOptions)
  }

}
