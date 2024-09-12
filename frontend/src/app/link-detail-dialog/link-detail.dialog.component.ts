import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Importiere MatSnackBar und MatSnackBarModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // MatIconModule importieren
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { HttpClient, HttpClientModule } from '@angular/common/http'; // HttpClient importieren
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-link-detail-dialog',
  templateUrl: './link-detail.dialog.component.html',
  styleUrls: ['./link-detail.dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, // MatIconModule hier hinzufügen
    MatSnackBarModule, // MatSnackBarModule hinzufügen
    FormsModule,
    MatCardModule,
    HttpClientModule,
    MatSelectModule,
    CommonModule
  ]
})
export class LinkDetailDialogComponent {
  @ViewChild('clipboardButton') clipboardButton!: ElementRef; // Non-null assertion operator verwendet

  link: string = ''; 
  label: string = '';
  password: string= '';
  description: string;
  username: string;
  category: string = '';

  categories: string[] = ['Arbeit', 'SocialMedia', 'Privat', 'Sonstiges'];

  isPasswordVisible = false;  // Steuert die Sichtbarkeit des Passworts

  togglePasswordVisibility(show: boolean) {
    this.isPasswordVisible = show;
  }

  constructor(
    public dialogRef: MatDialogRef<LinkDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      description: string; url: string; label: string; password: string; _id: string; websiteId: string; username: string; category: string
},
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.link = data.url;
    this.label = data.label;
    this.password = data.password;
    this.description = data.description || '';
    this.username = data.username || '';
    this.category = data.category || ''; // Set the category value here

  }
  

  // Methode zum Generieren eines sicheren Passworts
  generatePassword(): void {
    const parts = [];
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 3; i++) {
      let part = '';
      for (let j = 0; j < 6; j++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        part += charset[randomIndex];
      }
      parts.push(part);
    }
    const generatedPassword = `${parts[0]}-${parts[1]}-${parts[2]}`;
    this.data.password = generatedPassword;  // Setze das generierte Passwort in das Datenobjekt
  }
  
  openWebsite(url: string): void {
    // Überprüfe, ob die URL ein Protokoll enthält (http:// oder https://)
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url; // Füge 'https://' hinzu, wenn es fehlt
    }
  
    // Öffne die Webseite in einem neuen Tab
    window.open(url, '_blank');
  }


  onClose(): void {
    this.dialogRef.close();
  }


  onSave(): void {
    if (!this.data._id) {
      console.error('Kein gültiges _id für das Update vorhanden.');
      return;
    }

    const token = localStorage.getItem('token');  // Token für die Authentifizierung holen
    const updatedData = { 
      password: this.data.password,
      description: this.data.description,
      username: this.data.username,
      category: this.data.category
    }; 
    const url = `http://localhost:3000/api/links/${this.data._id}`;  // API-URL mit _id

    this.http.put(url, updatedData, {
      headers: { Authorization: `Bearer ${token}` }  // Token im Header mitgeben
    })
    .subscribe({
      next: (response) => {
        console.log('Passwort erfolgreich aktualisiert:', response);
        this.dialogRef.close(updatedData);  // Schließe den Dialog und übergebe die aktualisierten Daten
      },
      error: (err) => {
        console.error('Fehler beim Aktualisieren des Passworts:', err);
      }
    });
  }
  
  
  
  


  copyToClipboard(password: string): void {
    navigator.clipboard.writeText(password);
    // Zeige Snackbar
    this.snackBar.open('Kopiert!', '', {
      duration: 2000,
      verticalPosition:'top',
      horizontalPosition: 'center'
    });
    // Optional: Zeige Animation oder Feedback für das Kopieren
    this.clipboardButton.nativeElement.classList.add('copied');
    setTimeout(() => {
      this.clipboardButton.nativeElement.classList.remove('copied');
    }, 500);
  }

  // Diese Funktion entfernt das Protokoll (https:// oder http://) aus der URL
  stripProtocol(url: string): string {
    return url.replace(/(^\w+:|^)\/\//, '');
  }
  
}
