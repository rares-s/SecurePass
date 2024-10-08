import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private snackBar: MatSnackBar // Inject MatSnackBar service
  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.showSnackbar('Bitte geben Sie Benutzername und Passwort ein');
      return;
    }
  
    if (!this.validateEmail(this.email)) {
      this.showSnackbar('Bitte geben Sie eine korrekte E-Mail-Adresse ein');
      return;
    }
  
    // Wenn die Eingaben korrekt sind, sende die Anfrage an den Server
    this.http.post('http://localhost:3000/api/auth/login', { 
      email: this.email, 
      password: this.password 
    })
    .subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', this.email);
        this.router.navigate(['/home/dashboard']);  
      },
      error: (error) => {
        this.showSnackbar('Email oder Passwort falsch'); 
        console.error('Login failed', error);
      }
    });
  }

  validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
  
  showSnackbar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000, 
      verticalPosition: 'top', 
      horizontalPosition: 'center' 
    });
  }

  
  // Methode zum direkten Zugriff auf das Dashboard ohne Login
  routeRegistrieren() {
    this.router.navigate(['/register']);
  }

  routeForgotPassword() {
    this.router.navigate(['/forgot-password']);  // Navigiere zur Passwort vergessen Seite
  }
}
