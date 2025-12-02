import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { ProductStorageService } from '../services/product-storage.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit, OnDestroy {

  barcode: string = '';
  name: string = '';
  group: string = '';
  unit:string = '';
  price: number | null = null;

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

    // Tìm camera sau (back) theo label nếu có, fallback deviceId cuối
    let rearCamera = devices.find(d => d.label.toLowerCase().includes('back'))?.deviceId;
    if (!rearCamera) {
      rearCamera = devices[devices.length - 1].deviceId;
    }

    console.log('Sử dụng camera:', devices.find(d => d.deviceId === rearCamera)?.label || rearCamera);

    // Bắt đầu decode liên tục
    this.scannerControls = await this.reader.decodeFromVideoDevice(
      rearCamera,
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
      group: this.group,
      unit: this.unit,
      createdAt: new Date().toISOString(),
    });

    // reset form
    this.barcode = '';
    this.name = '';
    this.group = '';
    this.unit = '';
    this.price = null;

    this.startScan(); // scan tiếp
  }
}
