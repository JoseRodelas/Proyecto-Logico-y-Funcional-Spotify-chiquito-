import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookieManagerService {

  constructor(private cookieService: CookieService) {}

  set(nombre: string, valor: string, dias = 1, path: string = '/') {
    const encrypted = CryptoJS.AES.encrypt(valor, environment.secret_key).toString();
    this.cookieService.set(nombre, encrypted, { expires: dias, path });
  }

  get(nombre: string): string {
    const encrypted = this.cookieService.get(nombre);
    if (!encrypted) return '';

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, environment.secret_key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error al descifrar la cookie:', error);
      return '';
    }
  }

  delete(nombre: string, path: string = '/') {
    this.cookieService.delete(nombre, path);
  }

  check(nombre: string): boolean {
    return this.cookieService.check(nombre);
  }
}
