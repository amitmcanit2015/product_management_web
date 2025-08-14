import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../_config/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  API_URL = AppSettings.API_URL;

  constructor(private http: HttpClient) { }

  getProductList(): Observable<any> {
    return this.http.get<any>(this.API_URL +'GET_PRODUCT_LIST');
  }
  registerProduct(payload: any): Observable<any> {
    return this.http.post<any>(this.API_URL +'REGISTER_PRODUCT', { body: payload });
  }
  updateProduct(payload: any): Observable<any> {
    return this.http.put<any>(this.API_URL +'UPDATE_PRODUCT', { body: payload });
  }
  getProductByID(payload: any): Observable<any> {
    return this.http.post<any>(this.API_URL +'GET_PRODUCT_BY_ID', { body:payload });
  }
  deleteProduct(payload: any): Observable<any> {
    return this.http.delete<any>(this.API_URL +'DELETE_PRODUCT', { body: {payload} });
  }


}
