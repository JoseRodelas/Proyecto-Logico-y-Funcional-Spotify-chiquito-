import { Component, OnInit, OnDestroy } from '@angular/core';

import { SesionService } from '../../servicios/sesion.service';
import { environment } from 'src/environments/environment';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

@Component({
  selector: 'app-player',
  templateUrl: './spotify-player.component.html',
  styleUrls: ['./spotify-player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  player: any;
  deviceId: string = '';
  is_paused: boolean = true;
  current_track: any = null;
  position: number = 0;
  duration: number = 0;
  interval: any;
  isSyncingFromAPI: boolean = false;
  deviceName: string = '';

  usuarioLogueado : any = null;

  conexionSpoty = this.sesionService.obtenerSesionS();

  constructor(private sesionService: SesionService) {}

  ngOnInit(): void {
    this.loadSpotifySDK();
    this.updatePlaybackStatus();
    this.fincancion();

    this.sesionService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = !!usuario;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  getArtistNames(): string {
    return this.current_track?.artists?.map((artist: any) => artist.name).join(', ') || '';
  }

  loadSpotifySDK(): void {
    if(this.conexionSpoty)
    {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
      const token = this.sesionService.obtenerToken();

      if (!token) {
        console.error('No se pudo obtener el token para inicializar Spotify Player');
        return;
      }

      this.player = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: (cb: (token: string) => void): void => {
          cb(token);
        },
        volume: 0.5
      });

      this.player.addListener('ready', (data: { device_id: string }) => {
        this.deviceId = data.device_id;
        console.log('Ready with Device ID', this.deviceId);
      });

      this.player.addListener('player_state_changed', (state: any) => {
        if (!state) return;

        this.current_track = state.track_window.current_track;
        this.position = state.position;
        this.duration = state.duration;
        this.is_paused = state.paused;

        clearInterval(this.interval);
        if (!this.is_paused) {
          this.setupProgress();
        }
      });

      this.player.connect();
    };
    }
    
  }

  // Método para actualizar el estado de la canción desde la API
  updatePlaybackStatus(): void {
    this.interval = setInterval(() => {
      if (!this.isSyncingFromAPI && this.conexionSpoty) {
        this.isSyncingFromAPI = true;
        this.getCurrentPlayback().finally(() => {
          this.isSyncingFromAPI = false;
        });
      }
    }, 3000); // actualiza cada 3 segundos
  }

  // Ahora getCurrentPlayback devuelve una promesa
  getCurrentPlayback(): Promise<void> {
    let token = this.sesionService.obtenerToken();

    return fetch(`${environment.uri}/me/player`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async res => {
        if (res.status === 401) {
          console.warn('Token expirado. Intentando refrescar...');
          const nuevoToken = await this.sesionService.refreshAccessToken();
          if (nuevoToken) {
            return fetch(`${environment.uri}/me/player`, {
              headers: { 'Authorization': `Bearer ${nuevoToken}` }
            });
          }
        }
        return res;
      })
      .then(res => res?.json())
      .then(data => {
        if (data && data.item) {
          this.current_track = data.item;
          this.position = data.progress_ms;
          this.duration = data.item.duration_ms;
          this.is_paused = !data.is_playing;
          this.deviceName = data.device.name;
        }
      })
      .catch(error => {
        console.error('Error al obtener el estado actual:', error);
      });
  }

  togglePlay(): void {
    this.player.togglePlay();
  }

  setupProgress(): void {
    this.interval = setInterval(() => {
      if (!this.is_paused && this.position < this.duration && this.conexionSpoty) {
        this.position += 1000;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  fincancion(): void {
    this.interval = setInterval(() => {
      if (this.position >= this.duration) {
        this.updatePlaybackStatus();
      }else
      {
        //console.log(this.position);
        //console.log(this.duration);
      }
    }, 1000);
  }

  msToTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
  }

  nextTrack(): void {
    let token = this.sesionService.obtenerToken();
    fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(() => this.updatePlaybackStatus()) // actualiza la info
    .catch(err => console.error('Error al cambiar a la siguiente canción:', err));
  }

  previousTrack(): void {
    let token = this.sesionService.obtenerToken();
    fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(() => this.getCurrentPlayback())
    .catch(err => console.error('Error al regresar a la canción anterior:', err));
  }

  pauseTrack(): void {
    const token = this.getCurrentPlayback();
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(() => {
      this.is_paused = true;
      clearInterval(this.interval);
    })
    .catch(err => console.error('Error al pausar la canción:', err));
  }

  resumeTrack(): void {
    let token = this.sesionService.obtenerToken();
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(() => {
      this.is_paused = false;
      //this.setupProgress();
    })
    .catch(err => console.error('Error al reanudar la canción:', err));
  }

  togglePlayback(): void {
    let token = this.sesionService.obtenerToken();

    const url = this.is_paused
      ? 'https://api.spotify.com/v1/me/player/play'
      : 'https://api.spotify.com/v1/me/player/pause';

    fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(() => {
      this.is_paused = !this.is_paused;
      if (!this.is_paused) {
        //this.setupProgress();
      } else {
        clearInterval(this.interval);
      }
    })
    .catch(err => console.error('Error al cambiar el estado de reproducción:', err));
  }

}
