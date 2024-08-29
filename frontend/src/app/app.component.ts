import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';  
import { MatCardModule } from '@angular/material/card';  
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatDialog } from '@angular/material/dialog';
import { LinkDialogComponent } from './link-dialog/link-dialog.component';
import { CommonModule } from '@angular/common'; // Importiere CommonModule für *ngFor, *ngIf usw.
import { FormsModule } from '@angular/forms'; // Importiere FormsModule für ngModel
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    MatCardModule,
    FlexLayoutModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('transitionMessages', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300)
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})


export class AppComponent {
  title = 'SecurePass';
  links: { _id: string, title: string, url: string }[] = [];
  newLink: string = '';
  newLabel: string = ''; // Neuer Label für den Link
  showLinkInput: boolean = false;

  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {
    this.checkAuthentication();  // Prüft, ob der Benutzer eingeloggt ist
  }


  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
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

  // Lade Links vom Backend
  loadLinks() {
    this.http.get<any[]>('http://localhost:3000/api/links')
      .pipe(
        tap(data => {
          console.log('Loaded links:', data);  // Debug-Log
          this.links = data;
        }),
        catchError(this.handleError.bind(this))
      )
      .subscribe();
  }

  // Öffne den Dialog
  openDialog(): void {
    console.log('Opening dialog...');
    const dialogRef = this.dialog.open(LinkDialogComponent);

    dialogRef.afterClosed().subscribe((result: { url: string; label: string; }) => {
      if (result) {
        console.log('Dialog result:', result);
        this.createNewCard(result.url, result.label);
      }
    });
  }

  // Neue Kachel erstellen
  createNewCard(title: string, url: string) {
    // URL-Format prüfen
    if (!/^https?:\/\//i.test(title)) {
      title = 'https://' + title;
    }

    // Daten umgekehrt senden (absichtlich vertauscht)
    const newLink = { title: url, url: title };

    this.http.post('http://localhost:3000/api/links', newLink)
      .pipe(
        tap((data: any) => {
          console.log('Created new link:', data);
          this.links.push(data);  // Neue Kachel hinzufügen
        }),
        catchError(this.handleError.bind(this))
      )
      .subscribe();
  }

  // Kachel löschen
  deleteCard(id: string) {
    const url = `http://localhost:3000/api/links/${id}`;
    this.http.delete(url)
      .pipe(
        tap(() => {
          console.log(`Successfully deleted link with ID: ${id}`);
          this.links = this.links.filter(l => l._id !== id);  // Entferne das gelöschte Element aus dem Array
        }),
        catchError(this.handleError.bind(this))
      )
      .subscribe();
  }

  // Fehlerbehandlung für HTTP-Anfragen
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.status === 401) {
      console.error('Not authorized - redirecting to login');
      this.router.navigate(['/login']);  // Umleiten zur Login-Seite bei 401
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
