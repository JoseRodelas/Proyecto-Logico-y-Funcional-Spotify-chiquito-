import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';  // CookieService

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private usuarioSubject = new BehaviorSubject<any>(this.obtenerUsuarioDesdeCookies());

  constructor(private cookieService: CookieService) {}

  get usuario$() {
    return this.usuarioSubject.asObservable();
  }

  get usuarioActual() {
    return this.usuarioSubject.value;
  }

  iniciarSesion(usuario: any) {
    this.cookieService.set('usuario', JSON.stringify(usuario), { expires: 1, path: '/' });
    this.usuarioSubject.next(usuario);
  }

  cerrarSesion() {
    // Eliminar la cookie del usuario
    this.cookieService.delete('usuario', '/');
    this.usuarioSubject.next(null);
  }

  private obtenerUsuarioDesdeCookies(): any {
    // Leer la cookie de 'usuario' y devolverla si existe
    const data = this.cookieService.get('usuario');
    return data ? JSON.parse(data) : null;
  }

  obtenerToken(): string | null {
    const usuario = this.usuarioActual;
    return usuario?.token || null;
  }
}