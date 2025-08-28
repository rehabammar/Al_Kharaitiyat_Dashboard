import { Injectable } from "@angular/core";


export class SessionStorageUtil {
  static setItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static getItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  static removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}