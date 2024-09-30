import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBarModule
import { FormsModule } from '@angular/forms';  // Import FormsModule



@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, 
    MatButtonModule, 
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {

  private apiUrl = 'http://localhost:3000/api/users';
  public userData: any; // Hier werden die Benutzerdaten gespeichert
  oldPassword: string = ''; 
  newPassword: string = ''; 

  constructor(private router: Router, private http: HttpClient, private snackBar: MatSnackBar) {
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

// Password change functionality
changePassword() {
  const userId = this.userData._id; 
  const payload = { oldPassword: this.oldPassword, newPassword: this.newPassword };
  
  this.http.put(`http://localhost:3000/api/users/${userId}/changePassword`, payload)
    .subscribe({
      next: (response) => {
        this.snackBar.open('Password changed successfully!', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'top', 
          duration: 3000
        });

        
        this.oldPassword = '';
        this.newPassword = '';
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.snackBar.open('Passwort ändern fehlgeschlagen. Bitte versuchen Sie es erneut.', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'top', 
          duration: 3000
        });
      }
    });
}

  
  

  confirmDelete() {
    const snackBarRef = this.snackBar.open('Möchten Sie Ihr Konto wirklich löschen?', 'Löschen', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000, 
    });
  
    
    snackBarRef.onAction().subscribe(() => {
      
      const confirmSnackBar = this.snackBar.open('Sind Sie sicher?', 'Ja', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 5000,
      });
  
      
      confirmSnackBar.onAction().subscribe(() => {
        this.deleteAccount(); 
      });
    });
  

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
          this.snackBar.open('Account wurde erfolgreich gelöscht.', 'OK', {horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000}); 
          this.onLogout(); // Logge den Benutzer aus und leite zur Login-Seite weiter
        },
        error: (error) => {
          console.error('Error deleting user account:', error);
        }
      });
  }
}