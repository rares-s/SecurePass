import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;  // Der Benutzer ist eingeloggt
    } else {
      this.router.navigate(['/login']);  // Der Benutzer ist nicht eingeloggt
      return false;
    }
  }
}
