// src/app/servicios/sesion.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieManagerService } from './cookie-manager.service';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private usuarioSubject = new BehaviorSubject<any>(this.obtenerUsuarioDesdeCookies());

  constructor(private cookieManager: CookieManagerService) {}

  get usuario$() {
    return this.usuarioSubject.asObservable();
  }

  get usuarioActual() {
    return this.usuarioSubject.value;
  }

  iniciarSesion(usuario: any): void {
    this.cookieManager.set('usuario', JSON.stringify(usuario), 1, '/');
    this.usuarioSubject.next(usuario);
  }

  cerrarSesion(): void {
    this.cookieManager.delete('usuario', '/');
    this.usuarioSubject.next(null);
  }

  private obtenerUsuarioDesdeCookies(): any {
    const data = this.cookieManager.get('usuario');
    try {
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al parsear los datos del usuario:', error);
      return null;
    }
  }

  obtenerToken(): string | null {
    const usuario = this.usuarioActual;
    return usuario?.token || null;
  }
}
