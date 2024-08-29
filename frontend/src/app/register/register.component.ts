import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,  // <== FormsModule importieren, damit [(ngModel)] funktioniert
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}


onSubmit() {
  this.http.post('http://localhost:3000/api/auth/login', { email: this.email, password: this.password })
    .subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);  // Speichere den Token
        this.router.navigate(['/dashboard']);           // Weiterleiten nach Login
      },
      error: (error) => {
        alert('Login fehlgeschlagen. Überprüfen Sie Ihre Anmeldedaten.');
        console.error('Login failed', error);
      }
    });
}
}
