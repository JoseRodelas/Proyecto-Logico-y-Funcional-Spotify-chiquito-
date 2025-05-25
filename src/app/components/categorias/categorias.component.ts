import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../servicios/spotify.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  canciones: any[] = [];
  categoriaSeleccionada: any = null;
  cargando = false;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.getCategorias().subscribe(data => {
      this.categorias = data.categories.items.slice(0, 20); // Obtener solo las primeras 20 categorías
    });
  }

  seleccionarCategoria(categoria: any) {
    this.categoriaSeleccionada = categoria;
    this.canciones = [];
    this.cargando = true;

    this.spotifyService.getPlaylistsPorCategoria(categoria.id).subscribe(res => {
      const playlists: any[] = res.playlists.items.slice(0, 4); // Tomar solo 4 playlists
      let pendientes = playlists.length;

      playlists.forEach(playlist => {
        this.spotifyService.getCancionesDePlaylist(playlist.id).subscribe(tracksRes => {
          const cancionesPlaylist = tracksRes.items.map((item: any) => item.track);
          this.canciones.push(...cancionesPlaylist);

          pendientes--;
          if (pendientes === 0) {
            this.cargando = false;
          }
        }, error => {
          console.error('Error al cargar canciones:', error);
          pendientes--;
          if (pendientes === 0) {
            this.cargando = false;
          }
        });
      });
    });
  }

  regresar() {
    this.categoriaSeleccionada = null;
    this.canciones = [];
  }
}


