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
  links: { _id: string, title: string, url: string, password: string, gradient: string }[] = [];
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
          password: link.password || '',  // Falls das Passwort nicht vorhanden ist, setze es auf einen leeren String
          gradient: link.gradient || ''
        }));
      }),
      catchError(this.handleError)
    )
    .subscribe();
  }
  


 // Öffne den Dialog
openDialog(): void {
  console.log('Opening dialog...');
  const dialogRef = this.dialog.open(LinkDialogComponent);
  // Generiere den zufälligen Farbverlauf
  const gradient = this.generateRandomGradient();

  dialogRef.afterClosed().subscribe((result: { url: string; label: string; password: string; color: string }) => {
    if (result) {
      console.log('Dialog result:', result);
      this.createNewCard(result.url, result.label, result.password, result.color);
    }
  });
}

// Neue Kachel erstellen (mit Passwort und Farbverlauf)
createNewCard(title: string, url: string, password: string, gradient: string) {
  const token = localStorage.getItem('token');

  // URL-Format prüfen und https:// hinzufügen, wenn es fehlt
  if (!/^https?:\/\//i.test(title)) {
    title = 'https://' + title;
  }
  
  const newLink = { title: url, url: title, password, gradient }; // Gradient als String hinzufügen

  this.http.post('http://localhost:3000/api/links', newLink, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .pipe(
    tap((data: any) => {
      console.log('Created new link:', data);
      this.links.push({ ...data}); // Gradient zum Link hinzufügen
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

  onLogout() {
    localStorage.removeItem('token');  // Token aus dem Local Storage entfernen
    this.router.navigate(['/login']);  // Weiterleitung zur Login-Seite
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
  openDetailDialog(link: { _id: string; url: string; title: string; password: string }): void {
    const dialogRef = this.dialog.open(LinkDetailDialogComponent, {
      data: { _id: link._id, url: link.url, label: link.title, password: link.password }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Updated result: ", result); // Debug: Überprüfen, ob die aktualisierten Daten zurückkommen
  
        // Lade alle Links erneut aus der Datenbank, um sicherzustellen, dass die aktualisierten Daten angezeigt werden
        this.loadLinks();
      }
    });
  }
  
  
  

// Helper-Funktion, um einen zufälligen Farbverlauf zu generieren
generateRandomGradient(): string {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33FFF2', '#FF33FF', '#F3FF33', '#FF9A33', '#33FF8D', '#FF3333'];
  // Wähle zwei verschiedene zufällige Farben aus dem Array
  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  let randomColor2 = colors[Math.floor(Math.random() * colors.length)];

  // Verhindere, dass die beiden Farben gleich sind
  while (randomColor1 === randomColor2) {
    randomColor2 = colors[Math.floor(Math.random() * colors.length)];
  }

  return `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
}





}
  

