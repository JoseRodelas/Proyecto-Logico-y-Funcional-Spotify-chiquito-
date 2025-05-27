import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }

  interface SpotifyPlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: {
      current_track: {
        name: string;
        album: { images: { url: string }[] };
        artists: { name: string }[]; 
      };
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyPlayerService {
  private player: any;
  private deviceId: string | null = null;

  private _isPaused = new BehaviorSubject<boolean>(true);
  private _track = new BehaviorSubject<any>(null);
  private _position = new BehaviorSubject<number>(0);
  private _duration = new BehaviorSubject<number>(0);

  isPaused$ = this._isPaused.asObservable();
  track$ = this._track.asObservable();
  position$ = this._position.asObservable();
  duration$ = this._duration.asObservable();

  constructor() {}

  initializePlayer(token: string): void {
    if (this.player) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      this.player = new window.Spotify.Player({
        name: 'Reproductor Angular/Azure',
        getOAuthToken: (cb: (token: string) => void) => cb(token),
        volume: 0.8
      });

      this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
        this.deviceId = device_id;
        console.log('Spotify Web Player está listo con device ID:', device_id);
      });

      this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.warn('Dispositivo ya no está disponible', device_id);
      });

      this.player.addListener('player_state_changed', (state: SpotifyPlaybackState) => {
        if (!state) return;

        this._isPaused.next(state.paused);
        this._track.next(state.track_window.current_track);
        this._position.next(state.position);
        this._duration.next(state.duration);
      });

      this.player.connect();
    };

    // Cargar SDK si no existe
    if (!document.getElementById('spotify-sdk')) {
      const scriptTag = document.createElement('script');
      scriptTag.id = 'spotify-sdk';
      scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
      document.body.appendChild(scriptTag);
    } else {
      window.onSpotifyWebPlaybackSDKReady();
    }
  }

  getDeviceId(): string | null {
    return this.deviceId;
  }

  play(uri?: string, token?: string): void {
    if (!this.deviceId || !token) return;

    const body: any = {
      device_id: this.deviceId,
      ...(uri && { uris: [uri] })
    };

    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).catch((err: any) => console.error('Error al reproducir:', err));
  }

  pause(token: string): void {
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch((err: any) => console.error('Error al pausar:', err));
  }

  next(token: string): void {
    fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch((err: any) => console.error('Error al siguiente:', err));
  }

  previous(token: string): void {
    fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch((err: any) => console.error('Error al anterior:', err));
  }

  setVolume(volume: number): void {
    this.player?.setVolume(volume).catch((err: any) => console.error('Error al cambiar volumen:', err));
  }

  seekTo(positionMs: number): void {
    this.player?.seek(positionMs).catch((err: any) => console.error('Error al adelantar:', err));
  }
}
