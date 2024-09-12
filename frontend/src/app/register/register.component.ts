import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,  // <== FormsModule importieren, damit [(ngModel)] funktioniert
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  passwordConfirm: string = ''; 

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {} // Inject MatSnackBar

  onSubmit() {
    if (this.password !== this.passwordConfirm) {  // Check if passwords match
      this.showSnackbar('Passwörter stimmen nicht überein.');
      this.password = '';  
      this.passwordConfirm = '';  
      return;
    }

    console.log('Email:', this.email, 'Password:', this.password); // Debugging
  
    this.http.post('http://localhost:3000/api/auth/register', { email: this.email, password: this.password })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);  // Save the token
          this.router.navigate(['/home/dashboard']);      // Redirect after registration
        },
        error: (error) => {
          this.showSnackbar('Registrierung fehlgeschlagen. Überprüfen Sie Ihre Daten.');
          console.error('Registration failed', error);
        }
      });
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
