import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../_config/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API_URL = AppSettings.API_URL;
  
  constructor(private http: HttpClient) { }

  login(payload: any): Observable<any> {
      return this.http.post<any>(this.API_URL + 'LOGIN', { body:payload });
  }

}
