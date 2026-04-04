import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  passwordHash: string;
  isAdmin: boolean;
}


@Injectable({
  providedIn: 'root',
})
export class UserService {

  currentUser = signal<User | null>(null);

  constructor() {
  const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }
  
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7205/api/users';
  

  getUserById(id: number) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  registerUser(user: User) {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUserByEmail(email: string) {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }
  login(email: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }

}
