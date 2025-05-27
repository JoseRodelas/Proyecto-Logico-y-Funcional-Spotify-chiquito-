import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../servicios/spotify.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  canciones: any[] = [];
  nuevascancionesMostradas: any[] = [];  // Lista de canciones que se mostrarán inicialmente
  nuevascancionesTotales: any[] = [];  // Lista con todas las canciones obtenidas

  cancionesPorPagina: number = 6; // Cantidad de canciones a mostrar inicialmente

  topTracks: any[] = [];
  topTracksMostrados: any[] = [];
  topTracksTotales: any[] = [];

  favoritos: any[] = [];
  favoritosMostrados: any[] = [];
  favoritosTotales: any[] = [];

  podcasts: any[] = [];
  podcastsMostrados: any[] = [];
  podcastsTotales: any[] = [];

  constructor(private spotifyService: SpotifyService) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.obtenerTopTracks();
      await this.obtenerNuevosLanzamientos();
      await this.obtenerFavoritos();
    } catch (error) {
      console.error('Error durante la carga inicial:', error);
    }
  }

  async obtenerTopTracks(): Promise<void> {
    try {
      const data = await firstValueFrom(this.spotifyService.getTopTracks());
      this.topTracks = data;
      this.topTracksMostrados = this.topTracks.slice(0, this.cancionesPorPagina);
    } catch (error) {
      console.error('Error al obtener Top Tracks', error);
    }
  }

  async obtenerNuevosLanzamientos(): Promise<void> {
    try {
      const data = await firstValueFrom(this.spotifyService.getNuevosLanzamientos());
      this.nuevascancionesTotales = data;
      this.nuevascancionesMostradas = this.nuevascancionesTotales.slice(0, this.cancionesPorPagina);
    } catch (error) {
      console.error('Error al obtener nuevos lanzamientos', error);
    }
  }

  async obtenerFavoritos(): Promise<void> {
    try {
      const data = await firstValueFrom(this.spotifyService.getFavoritos());
      this.favoritos = data;
      this.favoritosMostrados = this.favoritos.slice(0, this.cancionesPorPagina);
    } catch (error) {
      console.error('Error al obtener los Favoritos', error);
    }
  }

  reproducir(uri: string): void {
    this.spotifyService.reproducirCancion(uri).subscribe({
      next: () => {
        console.log('Reproduciendo...');
      },
      error: (err) => {
        console.error('Error al reproducir:', err);
        if (err.status === 404) {
          alert('Debes tener un dispositivo activo (Spotify abierto en tu celular o PC).');
        } else if (err.status === 403) {
          alert('Requiere cuenta Premium para reproducir desde aquí.');
        }
      }
    });
  }

  reproducirAlbum(uri: string): void {
    this.spotifyService.reproducirAlbum(uri).subscribe({
      next: () => {
        console.log('Reproduciendo álbum...');
      },
      error: (err) => {
        console.error('Error al reproducir el álbum:', err);
        if (err.status === 404) {
          alert('Debes tener un dispositivo activo (Spotify abierto en tu celular o PC).');
        } else if (err.status === 403) {
          alert('Requiere cuenta Premium para reproducir desde aquí.');
        } else {
          alert('Hubo un error al intentar reproducir el álbum.');
        }
      }
    });
  }

  verMasTop(): void {
    const nuevaCantidad = this.nuevascancionesMostradas.length + this.cancionesPorPagina;
    this.nuevascancionesMostradas = this.nuevascancionesTotales.slice(0, nuevaCantidad);
  }

  
}