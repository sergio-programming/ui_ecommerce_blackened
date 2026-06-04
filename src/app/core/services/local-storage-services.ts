import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageServices {

  read<T>(key: string): T | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`[storage] Invalid JSON for key "${key}"`, error);
      this.remove(key);
      return null;
    }
  }

  write<T>(key: string, value: T): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    window.localStorage.removeItem(key);
  }

  private isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
