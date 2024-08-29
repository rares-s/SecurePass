import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:3000/api/auth/login', { 
      email: this.email, 
      password: this.password 
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        alert('Logged in successfully!');
        // Weiterleitung zum Dashboard hier einbauen, falls nötig
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
