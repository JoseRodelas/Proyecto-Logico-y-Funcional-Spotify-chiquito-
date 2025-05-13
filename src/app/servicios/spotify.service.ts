import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private baseUrl = 'http://localhost:3000'; // URL base del backend

  constructor(private http: HttpClient) { }

  obtenerTopTracks(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/top-tracks`);
  }

  obtenerFeaturedPlaylists(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/featured-playlists`);
  }

  obtenerPopPlaylists(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pop-playlists`);
  }
}
