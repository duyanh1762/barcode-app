import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExportCsvService {
  download(data: any[], filename = 'products.csv') {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data
      .map(r => Object.values(r).map(v => `"${v}"`).join(','))
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }
}
