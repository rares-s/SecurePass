import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common'; // Importiere CommonModule für *ngFor, *ngIf usw.
import { FormsModule } from '@angular/forms'; // Importiere FormsModule für ngModel
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { LinkDetailDialogComponent } from '../../link-detail-dialog/link-detail.dialog.component';
import { LinkDialogComponent } from '../../link-dialog/link-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, 
    MatIconModule, 
    MatCardModule, 
    MatDialogModule, 
    CommonModule, 
    FormsModule],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  title = 'SecurePass';
  links: { _id: string, title: string, url: string, password: string, gradient?: string }[] = [];
  newLink: string = '';
  newLabel: string = ''; // Neuer Label für den Link
  showLinkInput: boolean = false;

  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {
    // this.checkAuthentication();  // Prüft, ob der Benutzer eingeloggt ist
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Token not found, redirecting to login...");
      this.router.navigate(['/login']);
    } else {
      console.log("Token found, loading links...");
      this.loadLinks();  // Links laden, wenn eingeloggt
    }
  }

  // Überprüfe die Authentifizierung
  checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Not logged in - redirecting to login');
      this.router.navigate(['/login']);  // Umleiten zur Login-Seite
    } else {
      this.loadLinks();  // Links laden, wenn eingeloggt
    }
  }

  // Lade Links vom Backend, inklusive Passwort
  loadLinks() {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:3000/api/links', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .pipe(
      tap(data => {
        console.log('Loaded links (websites):', data);  // Debug-Log
        // Sicherstellen, dass auch das Passwort für jede Webseite geladen wird
        this.links = data.map(link => ({
          _id: link._id,
          title: link.title,
          url: link.url,
          password: link.password || ''  // Falls das Passwort nicht vorhanden ist, setze es auf einen leeren String
        }));
      }),
      catchError(this.handleError)
    )
    .subscribe();
  }

  onLogout() {
    localStorage.removeItem('token');  // Token aus dem Local Storage entfernen
    this.router.navigate(['/login']);  // Weiterleitung zur Login-Seite
  }
  


  // Öffne den Dialog
openDialog(): void {
  console.log('Opening dialog...');
  const dialogRef = this.dialog.open(LinkDialogComponent);

  dialogRef.afterClosed().subscribe((result: { url: string; label: string; password: string; }) => {
    if (result) {
      console.log('Dialog result:', result);
      this.createNewCard(result.url, result.label, result.password);
    }
  });
}

// Neue Kachel erstellen (mit Passwort und Farbverlauf)
createNewCard(title: string, url: string, password: string) {
  const token = localStorage.getItem('token');
  
  // URL-Format prüfen
  if (!/^https?:\/\//i.test(title)) {
    title = 'https://' + title;
  }

  // Generiere den zufälligen Farbverlauf
  const gradient = this.generateRandomGradient();

  const newLink = { title: url, url: title, password, gradient: this.generateRandomGradient() }; // Füge den Gradient hinzu

  this.http.post('http://localhost:3000/api/links', newLink, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .pipe(
    tap((data: any) => {
      console.log('Created new link:', data);
      this.links.push({ ...data, gradient: this.generateRandomGradient() });
    }),
    catchError(this.handleError)
  )
  .subscribe();
}



  // Kachel löschen
  deleteCard(id: string) {
    const token = localStorage.getItem('token');
    const url = `http://localhost:3000/api/links/${id}`;
    
    this.http.delete(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .pipe(
      tap(() => {
        console.log(`Successfully deleted link with ID: ${id}`);
        this.links = this.links.filter(link => link._id !== id);  // Entferne das gelöschte Element aus dem Array
      }),
      catchError(this.handleError)
    )
    .subscribe();
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

  // Neue Methode zum Öffnen des Detail-Dialogs
openDetailDialog(link: { url: string; title: string; password: string }): void {
  console.log('Opening detail dialog for:', link);
  this.dialog.open(LinkDetailDialogComponent, {
    data: { url: link.url, label: link.title, password: link.password }
  });
}

// Helper-Funktion, um einen zufälligen Farbverlauf zu generieren
generateRandomGradient(): string {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33FFF2', '#FF33FF', '#F3FF33', '#FF9A33', '#33FF8D', '#FF3333'];
  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
}

  
}
  

