// src/app/pages/callback/callback.component.ts
import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from 'src/app/servicios/spotify-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: `<p>Redirigiendo...</p>`
})
export class CallbackComponent implements OnInit {
  constructor(
    private spotifyAuth: SpotifyAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spotifyAuth.handleCallback();
    setTimeout(() => this.router.navigate(['/home']), 1000); 
  }
}
