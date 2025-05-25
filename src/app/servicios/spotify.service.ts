import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SesionService } from './sesion.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private baseUrl = 'https://api.spotify.com/v1';

  constructor(
    private http: HttpClient,
    private sesionService: SesionService
  ) {}

  private get headers(): HttpHeaders {
    const token = this.sesionService.obtenerToken(); // Tu método para recuperar el token
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getNuevosLanzamientos(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/browse/new-releases?limit=20`, { headers: this.headers })
      .pipe(map((res: any) => res.albums.items));
  }

  getTopTracks(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/me/top/tracks?limit=12`, { headers: this.headers })
      .pipe(map((res: any) => res.items));
  }

  getRecomendacionesPorArtista(artistaId: string): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/recommendations?limit=12&seed_artists=${artistaId}`, { headers: this.headers })
      .pipe(map((res: any) => res.tracks));
  }

  getRecomendacionesPorGenero(genero: string): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/recommendations?limit=12&seed_genres=${genero}`, { headers: this.headers })
      .pipe(map((res: any) => res.tracks));
  }

  getArtistasFavoritos(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/me/top/artists?limit=5`, { headers: this.headers })
      .pipe(map((res: any) => res.items));
  }

  // 1. Canciones guardadas (favoritos)
  getFavoritos(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/me/tracks?limit=50`, { headers: this.headers })
      .pipe(map((res: any) => res.items.map((item: any) => item.track))); // Extrae solo la canción
  }

  // 2. Música por categoría
  getCategorias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/browse/categories?limit=20`, {
      headers: this.headers
    });
  }

  getPlaylistsPorCategoria(categoryId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/browse/categories/${categoryId}/playlists?limit=3`, {
      headers: this.headers
    });
  }

  getCancionesDePlaylist(playlistId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/playlists/${playlistId}/tracks?limit=30`, {
      headers: this.headers
    });
  }

  // Reproducir musica
  reproducirCancion(uri: string): Observable<any> {
    const body = {
      uris: [uri]
    };
    return this.http.put(`${this.baseUrl}/me/player/play`, body, { headers: this.headers });
  }

  // Reproducir álbum
  reproducirAlbum(uri: string): Observable<any> {
    const body = {
      context_uri: uri
    };
    return this.http.put(`${this.baseUrl}/me/player/play`, body, { headers: this.headers });
  }
}
