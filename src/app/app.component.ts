import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nombreUsuario: any;
  theme: string = 'light-theme';
  usuarioLogueado = false;

  constructor(private sesionService: SesionService, private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void  {
    this.sesionService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = !!usuario;
    });

    // Verificar si hay un tema guardado en el localStorage
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    this.setTheme(savedTheme);

    // Suscribirse al servicio de sesión para obtener el usuario actual
    this.sesionService.usuario$.subscribe(usuario => {
      this.nombreUsuario = usuario;
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

  cerrarSesion() {
    this.sesionService.cerrarSesion();
    this.router.navigate(['/login']);
    this.nombreUsuario = null;
  }
}