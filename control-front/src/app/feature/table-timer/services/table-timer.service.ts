import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableTimerService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://127.0.0.1:8000/api';

  endWorkShift(code: string) {
    const body = { code };

    return this.http.post(`${this.baseUrl}/work-shifts/end`, body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  getWorkShiftsByCode(code: string) {
    const params = new HttpParams().set('code', code);

    return this.http.get(`${this.baseUrl}/work-shifts`, { params });
  }
}
