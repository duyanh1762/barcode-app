import { Component } from '@angular/core';
import { ExportCsvService } from '../services/export-csv.service';
import { ProductStorageService } from '../services/product-storage.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor,NgIf],
  template: `
    <h2>Danh sách sản phẩm</h2>

    <button (click)="export()">Export CSV</button>
    <button style="margin-left:8px" (click)="clear()">Xoá tất cả</button>

    <table *ngIf="products.length">
      <tr>
        <th>Mã</th>
        <th>Tên</th>
        <th>Giá</th>
        <th>HSD</th>
      </tr>

      <tr *ngFor="let p of products">
        <td>{{ p.barcode }}</td>
        <td>{{ p.name }}</td>
        <td>{{ p.price }}</td>
        <td>{{ p.expiry }}</td>
      </tr>
    </table>

    <p *ngIf="!products.length">Chưa có dữ liệu.</p>
  `
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
