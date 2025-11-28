import { Component } from '@angular/core';
import { ExportCsvService } from '../services/export-csv.service';
import { ProductStorageService } from '../services/product-storage.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = this.storage.getAll();

  constructor(
    private storage: ProductStorageService,
    private csv: ExportCsvService
  ) {}

  export() {
    this.csv.download(this.products);
  }

  clear() {
    this.storage.clear();
    this.products = [];
  }
}
