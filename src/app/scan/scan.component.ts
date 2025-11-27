import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { ProductStorageService } from '../services/product-storage.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [FormsModule,NgIf],
  template: `
    <h2>Quét mã vạch</h2>

    <video #video id="video" style="width:100%;height:auto;background:#000" autoplay muted playsinline></video>

    <div *ngIf="barcode" style="margin-top:16px">
      <p>Mã vạch: <b>{{ barcode }}</b></p>

      <label>Tên</label>
      <input [(ngModel)]="name" />

      <label>Giá</label>
      <input [(ngModel)]="price" type="number" />

      <label>Hạn sử dụng</label>
      <input [(ngModel)]="expiry" type="date" />

      <button (click)="save()">Lưu</button>
    </div>
  `
})
export class ScanComponent implements OnInit, OnDestroy {

  barcode = '';
  name = '';
  price: number | null = null;
  expiry = '';

  reader = new BrowserMultiFormatReader();
  private scannerControls?: IScannerControls;

  constructor(private storage: ProductStorageService) {}

  async ngOnInit() {
    await this.startScan();
  }

  ngOnDestroy() {
    this.stopScan();
  }

  async startScan() {
    const devices = await BrowserMultiFormatReader.listVideoInputDevices();
    if (!devices.length) {
      alert('Không tìm thấy camera!');
      return;
    }

    const deviceId = devices[0].deviceId;

    // Bắt đầu decode liên tục
    this.scannerControls = await this.reader.decodeFromVideoDevice(
      deviceId,
      'video',
      (result, error, controls) => {
        if (result) {
          this.barcode = result.getText();
          // Dừng camera sau khi quét được
          controls.stop();
        }
      }
    );
  }

  stopScan() {
    if (this.scannerControls) {
      this.scannerControls.stop();
      this.scannerControls = undefined;
    }
  }

  save() {
    this.storage.add({
      barcode: this.barcode,
      name: this.name,
      price: this.price,
      expiry: this.expiry,
      createdAt: new Date().toISOString(),
    });

    // reset form
    this.barcode = '';
    this.name = '';
    this.price = null;
    this.expiry = '';

    this.startScan(); // scan tiếp
  }
}
