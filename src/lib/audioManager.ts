/**
 * File-based music from /public/audio/.
 * Must call playFromUserGesture() synchronously inside a click/tap handler (iOS).
 */

import { CONFIG } from "../config";

const MUSIC_BEAT_MS = 2200;

type AudioSessionNavigator = Navigator & {
  audioSession?: { type: string };
};

export class AudioManager {
  private ambienceEl: HTMLAudioElement | null = null;
  private musicEl: HTMLAudioElement | null = null;
  private musicBeatInterval: ReturnType<typeof setInterval> | null = null;
  private keepAliveInterval: ReturnType<typeof setInterval> | null = null;
  private beatCallbacks: (() => void)[] = [];
  private listenersBound = false;
  ambienceOn = true;
  musicOn = true;
  private playing = false;

  private bindLifecycleListeners() {
    if (this.listenersBound || typeof window === "undefined") return;
    this.listenersBound = true;

    const onResume = () => {
      if (this.playing) void this.ensurePlayback();
    };

    window.addEventListener("visibilitychange", onResume);
    window.addEventListener("pageshow", onResume);
    window.addEventListener("focus", onResume);
  }

  private configureIOSPlayback() {
    const nav = navigator as AudioSessionNavigator;
    if (nav.audioSession) {
      nav.audioSession.type = "playback";
    }
  }

  private createAudio(src: string, volume: number): HTMLAudioElement {
    const el = new Audio(src);
    el.loop = true;
    el.volume = volume;
    el.preload = "auto";
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    el.load();
    return el;
  }

  /** Preload tracks as soon as the app mounts — no user gesture required */
  prepare() {
    this.bindLifecycleListeners();
    this.configureIOSPlayback();

    if (CONFIG.musicUrl && !this.musicEl) {
      this.musicEl = this.createAudio(CONFIG.musicUrl, 0.85);
    }
    if (CONFIG.ambienceUrl && !this.ambienceEl) {
      this.ambienceEl = this.createAudio(CONFIG.ambienceUrl, 0.35);
    }
  }

  private startMusicBeatSync() {
    if (!this.musicEl || this.musicBeatInterval) return;

    this.musicBeatInterval = setInterval(() => {
      if (this.musicOn && this.playing) {
        this.beatCallbacks.forEach((cb) => cb());
      }
    }, MUSIC_BEAT_MS);
  }

  private stopMusicBeatSync() {
    if (this.musicBeatInterval) {
      clearInterval(this.musicBeatInterval);
      this.musicBeatInterval = null;
    }
  }

  private startKeepAlive() {
    if (this.keepAliveInterval) return;

    this.keepAliveInterval = setInterval(() => {
      void this.ensurePlayback();
    }, 3000);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  onBeat(cb: () => void) {
    this.beatCallbacks.push(cb);
    return () => {
      this.beatCallbacks = this.beatCallbacks.filter((c) => c !== cb);
    };
  }

  private tryPlay(el: HTMLAudioElement) {
    const attempt = el.play();
    if (!attempt) return;

    void attempt.catch(() => {
      el.addEventListener(
        "canplaythrough",
        () => {
          if (this.playing) void el.play().catch(() => {});
        },
        { once: true },
      );
    });
  }

  /**
   * Start playback — call directly from onClick/onPointerDown without awaiting first.
   */
  playFromUserGesture() {
    this.prepare();
    this.playing = true;
    this.configureIOSPlayback();

    if (this.musicEl && this.musicOn) {
      this.musicEl.muted = false;
      this.tryPlay(this.musicEl);
      this.startMusicBeatSync();
    }

    if (this.ambienceEl && this.ambienceOn) {
      this.ambienceEl.muted = false;
      this.tryPlay(this.ambienceEl);
    }

    this.startKeepAlive();
  }

  /** @deprecated Use playFromUserGesture — kept for SoundToggle */
  start() {
    this.playFromUserGesture();
  }

  ensurePlayback() {
    if (!this.playing) return;

    if (this.musicEl && this.musicOn && this.musicEl.paused) {
      this.tryPlay(this.musicEl);
      this.startMusicBeatSync();
    }

    if (this.ambienceEl && this.ambienceOn && this.ambienceEl.paused) {
      this.tryPlay(this.ambienceEl);
    }
  }

  setAmbience(on: boolean) {
    this.ambienceOn = on;
    if (!this.ambienceEl) return;

    this.ambienceEl.muted = !on;
    if (on && this.playing) void this.ambienceEl.play();
    else this.ambienceEl.pause();
  }

  setMusic(on: boolean) {
    this.musicOn = on;
    if (!this.musicEl) return;

    this.musicEl.muted = !on;
    if (on) {
      if (!this.playing) this.playing = true;
      this.tryPlay(this.musicEl);
      this.startMusicBeatSync();
    } else {
      this.musicEl.pause();
      this.stopMusicBeatSync();
    }
  }

  destroy() {
    this.stopKeepAlive();
    this.stopMusicBeatSync();
    this.ambienceEl?.pause();
    this.musicEl?.pause();
  }
}

export const audioManager = new AudioManager();
