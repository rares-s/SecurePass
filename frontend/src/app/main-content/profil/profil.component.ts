import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {

  private apiUrl = 'http://localhost:3000/api/users';
  public userData: any; // Hier werden die Benutzerdaten gespeichert

  constructor(private router: Router, private http: HttpClient) {
    this.checkAuthentication();  // Prüft, ob der Benutzer eingeloggt ist
    const email = localStorage.getItem('email');
  }

  // Überprüfe die Authentifizierung
  checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Not logged in - redirecting to login');
      this.router.navigate(['/login']);  // Umleiten zur Login-Seite
    }
  }

  // Fehlerbehandlung
  handleError = (error: HttpErrorResponse) => {
    console.error('An error occurred:', error);
    if (error.status === 401) {
      console.error('Session expired or not authorized');
      this.onLogout();  // Logge den Benutzer aus, wenn der Token abgelaufen ist
      alert('Du wurdest ausgeloggt');  // Zeige eine Nachricht an
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  onLogout() {
    localStorage.removeItem('token');  // Token aus dem Local Storage entfernen
    this.router.navigate(['/login']);  // Weiterleitung zur Login-Seite
  }

ngOnInit() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log("Token not found, redirecting to login...");
    this.router.navigate(['/login']);
  } else {
    console.log("Token found");
    this.loadUser(token);  // Token an loadUser übergeben
  }
}

loadUser(token: string) {
  const email = localStorage.getItem('email');  // Hole die Email-Adresse aus dem Local Storage
  if (!email) {
    console.error('No email found in local storage');
    return;
  }
  
  this.http.get(`${this.apiUrl}/email/${email}`)
    .pipe(
      catchError(this.handleError)  // Fehlerbehandlung anwenden
    )
    .subscribe({
      next: (data) => {
        this.userData = data;  // Speichere die Benutzerdaten
        console.log('Logged in user data:', this.userData);  // Daten in der Konsole anzeigen
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  confirmDelete() {
    if (confirm('Bist du sicher, dass du dein Konto löschen möchtest?')) {
      this.deleteAccount();
    }
  }

deleteAccount() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Not logged in - redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    const userId = this.userData._id; // Benutzer-ID aus den Benutzerdaten entnehmen

    this.http.delete(`${this.apiUrl}/${userId}`)
      .pipe(
        catchError(this.handleError)
      )
      .subscribe({
        next: () => {
          alert('Account wurde erfolgreich gelöscht.');
          this.onLogout(); // Logge den Benutzer aus und leite zur Login-Seite weiter
        },
        error: (error) => {
          console.error('Error deleting user account:', error);
        }
      });
  }
}