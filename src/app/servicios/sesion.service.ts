// src/app/servicios/sesion.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieManagerService } from './cookie-manager.service';
import { environment } from 'src/environments/environment';

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

  obtenerSesionS(): string | null {
    const usuario = this.usuarioActual;
    return usuario?.spotifyConnected || false;
  }

  refreshAccessToken(): Promise<string | null> {
    const refresh_token = this.usuarioActual?.refresh_token;
    const client_id = environment.spotifyClientId;
    const client_secret = environment.spotifyClientSecret;

    if (!refresh_token) return Promise.resolve(null);

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      client_id,
      client_secret
    });

    return fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString()
    })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        const usuario = { ...this.usuarioActual, token: data.access_token };
        this.iniciarSesion(usuario); // Guarda el nuevo token
        return data.access_token;
      }
      return null;
    })
    .catch(err => {
      console.error('Error al refrescar el token:', err);
      return null;
    });
  }

}
