import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AppSettings } from '../_config/AppSettings';



@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {

  SECRET_KEY = AppSettings.SECRET_KEY

  getEncryptRoute(): string {
    let user: string = localStorage.getItem("user") ?? '';
    try {
      let encriptData = CryptoJS.AES.encrypt(user, this.SECRET_KEY).toString()
      return encodeURIComponent(encriptData);;
    } catch (error) {
      return '';
    }
  }

  getEncryptedData(data: string | number): string {
    let EncryptedData = CryptoJS.AES.encrypt(String(data), this.SECRET_KEY).toString();
    return EncryptedData;
  }


  getDecryptData(data: any): any {
    try {
      if (data != null && data != undefined) {
        const decryptedData = CryptoJS.AES.decrypt(data, this.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        return decryptedData;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }


}
