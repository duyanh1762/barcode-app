import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductStorageService {
  private key = 'scanned_products';

  getAll() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  add(product: any) {
    const list = this.getAll();
    list.push(product);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
