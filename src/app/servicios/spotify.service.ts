import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SesionService } from './sesion.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(
    private http: HttpClient,
    private sesionService: SesionService
  ) {}

  private get headers(): HttpHeaders {
    const token = this.sesionService.obtenerToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getNuevosLanzamientos(): Observable<any[]> {
    return this.http.get(`${environment.uri}/browse/new-releases?limit=24`, { headers: this.headers })
      .pipe(map((res: any) => res.albums.items));
  }

  getTopTracks(): Observable<any[]> {
    return this.http.get(`${environment.uri}/me/top/tracks?limit=12`, { headers: this.headers })
      .pipe(map((res: any) => res.items));
  }

  getRecomendacionesPorArtista(artistaId: string): Observable<any[]> {
    return this.http.get(`${environment.uri}/recommendations?limit=12&seed_artists=${artistaId}`, { headers: this.headers })
      .pipe(map((res: any) => res.tracks));
  }

  getRecomendacionesPorGenero(genero: string): Observable<any[]> {
    return this.http.get(`${environment.uri}/recommendations?limit=12&seed_genres=${genero}`, { headers: this.headers })
      .pipe(map((res: any) => res.tracks));
  }

  getArtistasFavoritos(): Observable<any[]> {
    return this.http.get(`${environment.uri}/me/top/artists?limit=5`, { headers: this.headers })
      .pipe(map((res: any) => res.items));
  }

  // 1. Canciones guardadas (favoritos)
  getFavoritos(): Observable<any[]> {
    return this.http.get(`${environment.uri}/me/tracks?limit=36`, { headers: this.headers })
      .pipe(map((res: any) => res.items.map((item: any) => item.track))); // Extrae solo la canción
  }

  // 2. Música por categoría
  getMusicaPorCategoria(categoriaId: string): Observable<any[]> {
    return this.http.get(`${environment.uri}/browse/categories/${categoriaId}?limit=30`, { headers: this.headers })
      .pipe(map((res: any) => res.playlists.items)); // Devuelve playlists relacionadas a la categoría
  }

  // Reproducir musica
  reproducirCancion(uri: string): Observable<any> {
    const body = {
      uris: [uri]
    };
    return this.http.put(`${environment.uri}/me/player/play`, body, { headers: this.headers });
  }

  // Reproducir álbum
  reproducirAlbum(uri: string): Observable<any> {
    const body = {
      context_uri: uri
    };
    return this.http.put(`${environment.uri}/me/player/play`, body, { headers: this.headers });
  }
}
