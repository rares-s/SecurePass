import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // Für Benachrichtigungen
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Importiere FormsModule
import { MatFormFieldModule } from '@angular/material/form-field';  // MatFormFieldModule importieren
import { MatInputModule } from '@angular/material/input';  // MatInputModule importieren
import { MatButtonModule } from '@angular/material/button';  // MatButtonModule importieren


@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ]  
  })

  export class ForgotPasswordComponent {
    email: string = '';
  

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:3000/api/forgot-password', { email: this.email })
      .subscribe({
        next: () => {
          this.snackBar.open('Link zum Zurücksetzen wurde an deine E-Mail gesendet.', 'OK', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Fehler beim Senden des Passwort-Links:', error);
          this.snackBar.open('E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es erneut.', 'OK', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
  }

  routeLogin() {
    this.router.navigate(['/login']);
  }
}
