import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    const clientId = environment.spotifyClientId;
    const redirectUri = encodeURIComponent('http://localhost:4200/callback'); 
    const scopes = environment.scopes;
    const state = this.generateRandomState(16);

    localStorage.setItem('spotify_auth_state', state);

    window.location.href =
      `https://accounts.spotify.com/authorize` +
      `?response_type=token` +
      `&client_id=${clientId}` +
      `&scope=${scopes}` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}` +
      `&show_dialog=true`; // ← aquí lo agregas
  }


  generateRandomState(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}
