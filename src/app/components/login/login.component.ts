import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SesionService } from '../../servicios/sesion.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nombre = '';
  correo = '';
  password = '';

  mensaje = '';
  alertaClase = '';

  constructor(private sesionService: SesionService, private router: Router) {}

  simularLogin() {
    if (!this.nombre.trim() || !this.correo.trim() || !this.password.trim()) {
      this.mensaje = 'Por favor, completa todos los campos.';
      this.alertaClase = 'alert-danger';
      return;
    }

    const usuarioSimulado = {
      nombre: this.nombre,
      correo: this.correo,
      spotifyConnected: false,
      token: this.generarTokenFalso()
    };

    this.mensaje = 'Inicio de sesión simulado exitosamente';
    this.alertaClase = 'alert-success';

    setTimeout(() => {
      this.mensaje = '';
      this.sesionService.iniciarSesion(usuarioSimulado);
      this.router.navigate(['/home']);
    }, 3000);
  }

  generarTokenFalso(): string {
    const payload = {
      nombre: this.nombre,
      correo: this.correo,
      fecha: new Date().toISOString()
    };
    return btoa(JSON.stringify(payload)); // codificación base64 simple
  }

  loginConSpotify() {
    const clientId = '883b452674924c99b93ae99633df61fc';
    const redirectUri = encodeURIComponent('http://localhost:4200/callback'); // o la URL de tu app
    const scopes = encodeURIComponent('user-read-private user-read-email');

    window.location.href =
      `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
  }
}
