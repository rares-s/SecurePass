import { Component, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { LinkDetailDialogComponent } from '../../link-detail-dialog/link-detail.dialog.component';
import { LinkDialogComponent } from '../../link-dialog/link-dialog.component';
import { MatSelectModule } from '@angular/material/select';  // Importiere MatSelectModule
import { SimpleChanges } from '@angular/core';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatIconModule, 
    MatCardModule, 
    MatDialogModule, 
    MatFormFieldModule,  
    MatInputModule,      
    CommonModule, 
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  title = 'SecurePass';
  links: { _id: string, title: string, url: string, password: string, gradient: string, description: string, username: string, category: string }[] = [];
  filteredLinks: { _id: string, title: string, url: string, password: string, gradient: string, description: string, username: string, category: string }[] = [];
  searchTerm: string = ''; 
  categories: string[] = ['Arbeit', 'SocialMedia', 'Privat', 'Sonstiges'];
  selectedCategory: string = 'Alle';  // Einzelne ausgewählte Kategorie
  

  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {
    this.category = '';
  }
  

  @Input() category: string = '';  // Empfängt die ausgewählte Kategorie

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Token not found, redirecting to login...");
      this.router.navigate(['/login']);
    } else {
      console.log("Token found, loading links...");
      this.loadLinks(); 
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category']) {
      this.filterLinksByCategory(this.category);
    }
  }
  filterLinksByCategory(category: string) {
    if (category === 'Alle') {
      this.filteredLinks = this.links;
    } else {
      this.filteredLinks = this.links.filter(link => link.category === category);
    }
  }

  loadLinks() {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:3000/api/links', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .pipe(
      tap(data => {
        this.links = data.map(link => ({
          _id: link._id,
          title: link.title,
          url: link.url,
          password: link.password || '',
          gradient: link.gradient || '',
          description: link.description || '',
          username: link.username || '',
          category: link.category || ''
        }));
        this.filteredLinks = this.links; // Alle Links initial anzeigen
      }),
      catchError(this.handleError)
    )
    .subscribe();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;  // Kategorie als Zeichenkette speichern
    if (category === 'Alle') {
      this.filteredLinks = this.links;
    } else {
      this.filteredLinks = this.links.filter(link => link.category === category);
    }
}


  onSearch(event: any) {
    const searchTerm = event.target.value.trim().toUpperCase();

    if (searchTerm) {
      this.filteredLinks = this.links.filter(link => link.title.toUpperCase().includes(searchTerm));
    } else {
      this.filteredLinks = this.links; // Zeige alle Links an, wenn kein Suchbegriff eingegeben ist
    }
  }
  

  resetSearch() {
    this.searchTerm = '';
    this.filteredLinks = this.links; // Alle Links zurücksetzen
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LinkDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNewCard(
          result.url, 
          result.label, 
          result.password, 
          result.color, 
          result.description,
          result.username,
          result.category
        );
      }
    });
  }

  createNewCard(title: string, url: string, password: string, gradient: string, description: any, username: string, category: string = 'Sonstiges') {
    const token = localStorage.getItem('token');
  
    // URL-Format prüfen und https:// hinzufügen, wenn es fehlt
    if (!/^https?:\/\//i.test(title)) {
      title = 'https://' + title;
    }
  
    // Verwende entweder die Benutzerfarbe oder eine zufällige Farbe
    const finalGradient = this.generateGradientWithUserColor(gradient);
  
    const newLink = { title: url, url: title, password, gradient: finalGradient, description, username, category };
  
    this.http.post('http://localhost:3000/api/links', newLink, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .pipe(
      tap((data: any) => {
        this.links.push({ ...data });
        this.filteredLinks = this.links;
      }),
      catchError(this.handleError)
    )
    .subscribe();
  }
  
  // Funktion zur Erstellung eines Gradienten mit der Benutzerfarbe oder einer zufälligen Farbe
generateGradientWithUserColor(userColor: string): string {
  const colors = ['#FF5733', 
    '#33FF57', 
    '#3357FF', 
    '#FF33A8', 
    '#33FFF2', 
    '#FF33FF', 
    '#F3FF33', 
    '#FF9A33', 
    '#33FF8D', 
    '#FF3333'
  ];
  
  // Wähle eine zufällige Farbe aus dem Array als randomColor1
  let randomColor1 = userColor || colors[Math.floor(Math.random() * colors.length)];


  // Benutzerfarbe als randomColor2 oder wähle zufällig, wenn keine Benutzerfarbe angegeben ist
  let randomColor2 = colors[Math.floor(Math.random() * colors.length)];

  // Verhindere, dass die beiden Farben gleich sind, um bessere visuelle Kontraste zu erzeugen
  while (randomColor2 === randomColor1) {
    randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  }

  // Farbverlauf mit Benutzerfarbe (70% der Fläche) und zufälliger Farbe
  return `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
}

  

  deleteCard(id: string) {
    const token = localStorage.getItem('token');
    const url = `http://localhost:3000/api/links/${id}`;
    
    this.http.delete(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .pipe(
      tap(() => {
        this.links = this.links.filter(link => link._id !== id);
        this.filteredLinks = this.links; // Update filteredLinks as well
      }),
      catchError(this.handleError)
    )
    .subscribe();
  }

  onLogout() {
    localStorage.removeItem('token');  
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  handleError = (error: HttpErrorResponse) => {
    console.error('An error occurred:', error);
    if (error.status === 401) {
      this.onLogout();
      alert('Du wurdest ausgeloggt'); 
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  openDetailDialog(link: { _id: string; url: string; title: string; password: string, description: string, username: string, category: string }): void {
    const dialogRef = this.dialog.open(LinkDetailDialogComponent, {
      data: { _id: link._id, url: link.url, label: link.title, password: link.password, description: link.description, username: link.username, category: link.category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLinks();
      }
    });
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Arbeit':
        return 'work'; // Icon für Arbeit
      case 'SocialMedia':
        return 'group'; // Icon für Social Media
      case 'Privat':
        return 'lock'; // Icon für Privat
      case 'Sonstiges':
        return 'category'; // Icon für Sonstiges
      default:
        return 'category'; // Standard Icon
    }
  }
}
