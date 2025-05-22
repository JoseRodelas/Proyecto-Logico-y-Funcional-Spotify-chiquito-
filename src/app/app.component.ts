import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from './servicios/spotify.service'; // Asegúrate que está importado
import { SesionService } from './servicios/sesion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  nombreUsuario: any;
  theme: string = 'light-theme';
  usuarioLogueado = false;
  textoBusqueda: string = '';
  resultadosBusqueda: any[] = [];

  constructor(
    private sesionService: SesionService,
    private router: Router,
    private renderer: Renderer2,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.sesionService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = !!usuario;
      this.nombreUsuario = usuario;
    });

    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    this.setTheme(savedTheme);
  }

  toggleTheme(): void {
    const newTheme = this.theme === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.setTheme(newTheme);
  }

  private setTheme(theme: string): void {
    this.theme = theme;
    localStorage.setItem('theme', theme);

    const body = document.body;
    this.renderer.removeClass(body, 'light-theme');
    this.renderer.removeClass(body, 'dark-theme');
    this.renderer.addClass(body, theme);
  }

  cerrarSesion(): void {
    this.sesionService.cerrarSesion();
    this.router.navigate(['/login']);
    this.nombreUsuario = null;
  }

  // 🎯 Buscar canciones con texto
  buscarCanciones(): void {
    if (!this.textoBusqueda.trim()) return;

    this.spotifyService.buscarCanciones(this.textoBusqueda.trim())
      .subscribe(resultados => {
        this.resultadosBusqueda = resultados;
      });
  }

  // ▶️ Reproducir canción
reproducir(uri: string): void {
  this.spotifyService.reproducirCancion(uri).subscribe({
    next: () => {

    },
    error: err => {
      console.error('❌ Error al reproducir:', err);
      alert('❌ No se pudo reproducir. Asegúrate de tener Spotify abierto en algún dispositivo.');
    }
  });
}

}
