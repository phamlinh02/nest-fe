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

  getAllOrder(order: any, header ?: any): Observable<any> {
    let url = '/get-all';
    if(header){
      url += `?size=${header.size}&page=${header.page}`;
    }
    return this.http.post(ORDER_API + url, order, httpOptions)
  }

  getBillDetail(id: number): Observable<any> {
    return this.http.get(ORDER_API + `/get-detail/${id}`, httpOptions)
  }

  saveBill(bill : any): Observable<any> {
    return this.http.post(ORDER_API + `/update`,bill, httpOptions)
  }
  getStatisticsBill(): Observable<any> {
    return this.http.get(ORDER_API + `/statistics`, httpOptions)
  }
  latestBill(): Observable<any> {
    return this.http.get(ORDER_API + `/order-bill`, httpOptions)
  }

}
