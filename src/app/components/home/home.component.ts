import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../servicios/spotify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  canciones: any[] = [];
  cancionesMostradas: any[] = [];  // Lista de canciones que se mostrarán inicialmente
  cancionesTotales: any[] = [];  // Lista con todas las canciones obtenidas
  cancionesPorPagina: number = 6; // Cantidad de canciones a mostrar inicialmente

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.obtenerTopTracks().subscribe(
      (data) => {
        this.cancionesTotales = data;  // Guardar todas las canciones
        this.cancionesMostradas = this.cancionesTotales.slice(0, this.cancionesPorPagina);  // Mostrar las primeras 6 canciones
      },
      (error) => {
        console.error('Error al obtener las canciones', error);
      }
    );
  }

  verMas(): void {
    const cantidadNueva = this.cancionesMostradas.length + this.cancionesPorPagina;
    this.cancionesMostradas = this.cancionesTotales.slice(0, cantidadNueva);
  }
}