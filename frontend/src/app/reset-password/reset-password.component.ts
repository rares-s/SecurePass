import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-reset-password',
  standalone: true, 
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Holen des Tokens aus der URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  resetPassword(): void {
    // Überprüfe, ob eines der Passwörter leer ist
    if (this.newPassword.trim() === '' || this.confirmPassword.trim() === '') {
      alert('Passwort darf nicht leer sein');
      return;
    }

    // Überprüfe, ob die Passwörter übereinstimmen
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwörter stimmen nicht überein!');
      return;
    }

    // Passwort zurücksetzen
    this.http.post(`http://localhost:3000/api/reset-password/${this.token}`, { newPassword: this.newPassword })
      .subscribe({
        next: (response) => {
          alert('Passwort erfolgreich zurückgesetzt!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Fehler beim Zurücksetzen des Passworts:', error);
          alert('Fehler beim Zurücksetzen des Passworts. Bitte versuche es erneut.');
        }
      });
  }
}
