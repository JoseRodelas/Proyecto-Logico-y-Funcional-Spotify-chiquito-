import { Component, OnInit, Renderer2, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SpotifyService } from './servicios/spotify.service';
import { SesionService } from './servicios/sesion.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mostrarPlayer: boolean = false;
  nombreUsuario: any;
  theme: string = 'light-theme';
  usuarioLogueado = false;
  textoBusqueda: string = '';
  resultadosBusqueda: any[] = [];

  @ViewChild('buscadorContainer') buscadorContainer!: ElementRef;

  constructor(
    private sesionService: SesionService,
    private router: Router,
    private renderer: Renderer2,
    private spotifyService: SpotifyService,
    private eRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.sesionService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = !!usuario;
      this.nombreUsuario = usuario;
    });

    // Verificar si hay un tema guardado en el localStorage
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    this.setTheme(savedTheme);

    // Mostrar el player solo en rutas específicas
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event) => {
      const navEndEvent = event as NavigationEnd;
      const rutasConPlayer = ['/home', '/favorites', '/about'];
      this.mostrarPlayer = rutasConPlayer.includes(navEndEvent.urlAfterRedirects);
    });
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

  buscarCanciones(): void {
    if (!this.textoBusqueda.trim()) {
      this.resultadosBusqueda = [];
      return;
    }

    this.spotifyService.buscarCanciones(this.textoBusqueda.trim())
      .subscribe(resultados => {
        this.resultadosBusqueda = resultados;
      });
  }

  reproducir(uri: string): void {
    this.spotifyService.reproducirCancion(uri).subscribe({
      next: () => {},
      error: err => {
        console.error('❌ Error al reproducir:', err);
        alert('❌ No se pudo reproducir. Asegúrate de tener Spotify abierto en algún dispositivo.');
      }
    });
  }

  // Detectar clic fuera del buscador
  @HostListener('document:click', ['$event'])
  clickFuera(event: Event): void {
    if (this.buscadorContainer && !this.buscadorContainer.nativeElement.contains(event.target)) {
      this.resultadosBusqueda = [];
    }
  }
}
