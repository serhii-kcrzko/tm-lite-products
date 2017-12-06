import { Injectable } from '@angular/core';

// TODO: implement full blown authorisation
@Injectable()
export class AuthService {
  login(user: string, password: string): boolean {
    if (user === 'serhii.kocherezhko@outlook.com' && password === 'sergiq2403') {
      localStorage.setItem('username', user);
      return true;
    }

    return false;
  }

  logout(): any {
    localStorage.removeItem('username');
  }

  getUser(): any {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
