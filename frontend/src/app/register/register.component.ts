import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar
import { MatProgressBarModule } from '@angular/material/progress-bar';  // MatProgressBarModule importieren
import { CommonModule } from '@angular/common';  // Import CommonModule to enable *ngIf


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,  // <== FormsModule importieren, damit [(ngModel)] funktioniert
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  passwordConfirm: string = ''; 
  username: string = '';

  passwordStrength: number = 0;  // Variable für Passwortstärke
  passwordStrengthDescription: string = 'Schwach';  // Initialize with a default value

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {} // Inject MatSnackBar

  onSubmit() {

    if (!this.validateEmail(this.email)) {
      this.showSnackbar('Bitte eine gültige E-Mail-Adresse eingeben.');
      return;
    }

    // Check if username is empty
    if (!this.username.trim()) {
      this.showSnackbar('Bitte Benutzernamen eingeben.');
      return;
    }
  
    // Check for valid email format using a regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for validating email format
    if (!emailRegex.test(this.email)) {
      this.showSnackbar('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
  
    // Check if passwords match
    if (this.password !== this.passwordConfirm) {  
      this.showSnackbar('Passwörter stimmen nicht überein.');
      this.password = '';  
      this.passwordConfirm = '';  
      return;
    }

    if (this.passwordStrength < 100) {
      this.showSnackbar('Passwort erfüllt nicht die Sicherheitsanforderungen. Großbuchstabe & Sonderzeichen & Zahl müssen enthalten sein.');
      return;
    }
  
    // Submit registration data
    this.http.post('http://localhost:3000/api/auth/register', {
      username: this.username, 
      email: this.email, 
      password: this.password 
    })
    .subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);  // Speichere den Token
        localStorage.setItem('email', this.email); 
        this.router.navigate(['/home/dashboard']);      // Weiterleiten nach Registrierung
      },
      error: (error) => {
        if (error.status === 409) {  // Assuming the server sends a 409 status code for existing email
          this.showSnackbar('E-Mail-Adresse wird bereits verwendet.');
        } else {
          this.showSnackbar('Registrierung fehlgeschlagen. Überprüfen Sie Ihre Daten.');
        }
        console.error('Registration failed', error);
      }
    });
  }

  checkPasswordStrength() {
    let strength = 0;
  
    // Check length
    if (this.password.length >= 8) {
      strength += 30; // Adjust to give more weight to length
    }
    if (this.password.length >= 12) {
      strength += 20; // Add bonus for extra length
    }
  
    // Check for uppercase, numbers, and special characters
    if (/[A-Z]/.test(this.password)) strength += 20;
    if (/\d/.test(this.password)) strength += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) strength += 15;
    if (/[a-z]/.test(this.password)) strength += 10;
  
    // Reduce penalty for repeated characters, if needed
    if (/(.)\1{2,}/.test(this.password)) strength -= 5;
  
    // Cap the strength to 100
    this.passwordStrength = Math.min(Math.max(strength, 0), 100);
  
    // Assign strength description
    if (this.passwordStrength <= 30) {
      this.passwordStrengthDescription = 'Schwach';
    } else if (this.passwordStrength <= 60) {
      this.passwordStrengthDescription = 'Mittelmäßig';
    } else if (this.passwordStrength <= 80) {
      this.passwordStrengthDescription = 'Stark';
    } else if (this.passwordStrength < 100) {
      this.passwordStrengthDescription = 'Sehr Stark';
    } else {
      this.passwordStrengthDescription = 'Fast Unmöglich';
    }
  }
  
  
  
  
  // E-Mail-Validierung
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  
  // Snackbar method for displaying messages
  showSnackbar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000, 
      verticalPosition: 'top', 
      horizontalPosition: 'center' 
    });
  }

  routeLogin() {
    this.router.navigate(['/']); // Navigate to login page
  }
}
