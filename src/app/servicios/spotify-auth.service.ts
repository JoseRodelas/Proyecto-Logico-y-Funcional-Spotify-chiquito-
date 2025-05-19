import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SesionService } from './sesion.service';

@Injectable({ providedIn: 'root' })
export class SpotifyAuthService {
  private clientId = environment.spotifyClientId;
  private redirectUri = environment.redirectUri;
  private scopes = environment.scopes;

  constructor(private http: HttpClient, private sesionService: SesionService) {}

  login() {
    const state = this.generateRandomString(16);
    const url = `https://accounts.spotify.com/authorize` +
      `?response_type=token` +
      `&client_id=${encodeURIComponent(this.clientId)}` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
      `&scope=${encodeURIComponent(this.scopes)}` +
      `&state=${encodeURIComponent(state)}` +
      `&show_dialog=true`; 


    localStorage.setItem('spotify_auth_state', state);
    console.log('Scope enviado:', this.scopes);
    console.log('URL de autorización:', url);
    
    alert('Error en la autenticación con Spotify');
    window.location.href = url;
  }

  handleCallback(): void {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const state = params.get('state');

    const savedState = localStorage.getItem('spotify_auth_state');
    if (!accessToken || state !== savedState) {
      alert('Error en la autenticación con Spotify');
      return;
    }

    localStorage.removeItem('spotify_auth_state');
    this.obtenerPerfilSpotify(accessToken);
    console.log('Access Token recibido:', accessToken);

  }

  private obtenerPerfilSpotify(accessToken: string): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    this.http.get('https://api.spotify.com/v1/me', { headers }).subscribe({
      next: (perfil: any) => {
        console.log('Perfil de Spotify recibido:', perfil); 
        const usuario = {
          nombre: perfil.display_name,
          correo: perfil.email,
          id: perfil.id,
          imagen: perfil.images?.[0]?.url,
          token: accessToken,
          origen: 'spotify'
        };
        this.sesionService.iniciarSesion(usuario);
      },
      error: (err) => {
        console.error('Error al obtener el perfil de Spotify', err);  
        alert('Error al obtener el perfil de Spotify');
      }
    });
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}
