import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token');
    console.log('AuthService - Token initial:', this.token);
  }

  
  register(credentials: { email: string; password: string; username?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          this.token = res.token;
          localStorage.setItem('token', res.token);
          console.log('Register - Token stocké:', this.token);
          this.router.navigate(['/user-tasks']); 
        } else {
          console.error('Register - Pas de token dans la réponse');
        }
      }),
    );
  }

 
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          this.token = res.token;
          localStorage.setItem('token', res.token);
          console.log('Login - Token stocké:', this.token);
          this.router.navigate(['/user-tasks']);
        } else {
          console.error('Login - Pas de token dans la réponse');
        }
      }),
    );
  }

 
  getToken(): string | null {
    return this.token;
  }


  getCurrentUserId(): number | null {
    if (!this.token) {
      console.warn('Aucun token trouvé pour récupérer l’ID utilisateur');
      return null;
    }
    try {
      const payload = this.decodeToken(this.token);
      return payload.sub || payload.userId || null;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

 
  logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

 
  isLoggedIn(): boolean {
    return !!this.token;
  }


  private decodeToken(token: string): any {
    const base64Url = token.split('.')[1]; 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  }
}