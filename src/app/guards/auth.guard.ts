import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('usuario') || document.cookie.includes('usuario');

    if (token) {
      return true; // El usuario tiene sesión activa
    }

    // Si no hay sesión, redirige al login
    this.router.navigate(['/login']);
    return false;
  }
}