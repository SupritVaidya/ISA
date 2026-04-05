import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7205/api/contact';

  sendMessage(name: string, email: string, message: string) {
    return this.http.post(this.apiUrl, { name, email, message });
  }
}
