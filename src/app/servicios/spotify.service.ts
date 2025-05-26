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
  conexionSpoty = this.sesionService.obtenerSesionS();

  constructor(
    private http: HttpClient,
    private sesionService: SesionService
  ) {}

  private get headers(): HttpHeaders {
    const token = this.sesionService.obtenerToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getNuevosLanzamientos(): Observable<any[]> {
    if(this.conexionSpoty)
    {
      return this.http.get(`${environment.uri}/browse/new-releases?limit=24`, { headers: this.headers })
      .pipe(map((res: any) => res.albums.items));
    }
    else
    {
      return new Observable<[]>;
    }
  }

  getTopTracks(): Observable<any[]> {
    if(this.conexionSpoty)
    {
      return this.http.get(`${environment.uri}/me/top/tracks?limit=12`, { headers: this.headers })
      .pipe(map((res: any) => res.items));
    }
    else
    {
      return new Observable<[]>;
    }
    
  }

  getRecomendacionesPorArtista(artistaId: string): Observable<any[]> {
    if(this.conexionSpoty)
    {
      return this.http.get(`${environment.uri}/recommendations?limit=12&seed_artists=${artistaId}`, { headers: this.headers })
      .pipe(map((res: any) => res.tracks));
    }
    else
    {
      return new Observable<[]>;
    }
    
  }

  getRecomendacionesPorGenero(genero: string): Observable<any[]> {
    if(this.conexionSpoty)
    {
      return this.http.get(`${environment.uri}/recommendations?limit=12&seed_genres=${genero}`, { headers: this.headers })
      .pipe(map((res: any) => res.tracks));
    }
    else
    {
      return new Observable<[]>;
    }
    
  }

  getArtistasFavoritos(): Observable<any[]> {
    if(this.conexionSpoty)
    {
      return this.http.get(`${environment.uri}/me/top/artists?limit=5`, { headers: this.headers })
      .pipe(map((res: any) => res.items));
    }
    else
    {
      return new Observable<[]>;
    }
    
  }

  // 1. Canciones guardadas (favoritos)
  getFavoritos(): Observable<any[]> {
    if(this.conexionSpoty)
    {
      return this.http.get(`${environment.uri}/me/tracks?limit=36`, { headers: this.headers })
      .pipe(map((res: any) => res.items.map((item: any) => item.track)));
    }
    else
    {
      return new Observable<[]>;
    }
    
  }

  // 2. Música por categoría
  getMusicaPorCategoria(categoriaId: string): Observable<any[]> {
    if(this.conexionSpoty)
    {
      return this.http.get(`${environment.uri}/browse/categories/${categoriaId}?limit=30`, { headers: this.headers })
      .pipe(map((res: any) => res.playlists.items)); // Devuelve playlists relacionadas a la categoría
    }
    else
    {
      return new Observable<[]>;
    }
    
  }

  buscarCanciones(texto: string): Observable<any[]> {
    return this.http.get(`${environment.uri}/search?q=${encodeURIComponent(texto)}&type=track&limit=4`, { headers: this.headers })
      .pipe(map((res: any) => res.tracks.items));
  }

  // Reproducir musica
  reproducirCancion(uri: string): Observable<any> {
    if(this.conexionSpoty)
    {
      const body = {
        uris: [uri]
      };
      return this.http.put(`${environment.uri}/me/player/play`, body, { headers: this.headers });
    }
    else
    {
      return new Observable<[]>;
    }
    
  }

  // Reproducir álbum
  reproducirAlbum(uri: string): Observable<any> {
    if(this.conexionSpoty)
    {
      const body = {
        context_uri: uri
      };
      return this.http.put(`${environment.uri}/me/player/play`, body, { headers: this.headers });
    }
    else
    {
      return new Observable<[]>;
    }
    
  }
}
