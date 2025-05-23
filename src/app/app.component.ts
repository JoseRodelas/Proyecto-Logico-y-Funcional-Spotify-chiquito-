import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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

  constructor(
    private sesionService: SesionService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de sesión
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
}
