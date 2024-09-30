import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@Component({
  selector: 'app-link-detail-dialog',
  templateUrl: './link-detail.dialog.component.html',
  styleUrls: ['./link-detail.dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, 
    MatSnackBarModule, 
    FormsModule,
    MatCardModule,
    HttpClientModule,
    MatSelectModule,
    CommonModule,
    MatProgressBarModule
  ]
})
export class LinkDetailDialogComponent {
  @ViewChild('clipboardButton') clipboardButton!: ElementRef; 

  link: string = ''; 
  label: string = '';
  password: string= '';
  description: string;
  username: string;
  category: string = '';

  categories: string[] = ['Arbeit', 'SocialMedia', 'Privat', 'Sonstiges'];

  isPasswordVisible = false;  
  passwordStrength: number = 0;  
  passwordStrengthDescription: string = 'Schwach';  


  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
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
    this.category = data.category || ''; 

  }
  

checkPasswordStrength(): void {
  let strength = 0;

  const password = this.data.password || ''; 

  // Check length
  if (password.length >= 8) {
    strength += 30; 
  }
  if (password.length >= 12) {
    strength += 20; 
  }

  if (/[A-Z]/.test(password)) strength += 20;
  if (/\d/.test(password)) strength += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;
  if (/[a-z]/.test(password)) strength += 10;

  if (/(.)\1{2,}/.test(password)) strength -= 5;


  this.passwordStrength = Math.min(Math.max(strength, 0), 100);

   if (this.passwordStrength <= 30) {
    this.passwordStrengthDescription = 'Schwach';
  } else if (this.passwordStrength <= 60) {
    this.passwordStrengthDescription = 'Mittelmäßig';
  } else if (this.passwordStrength <= 80) {
    this.passwordStrengthDescription = 'Stark';
  } else if (this.passwordStrength < 100) {
    this.passwordStrengthDescription = 'Sehr Stark';
  } else {
    this.passwordStrengthDescription = 'Fast Unmöglich';
  }
}
  

// Methode zum Generieren eines sicheren Passworts
generatePassword(): void {
  const parts = [];
  const charsetLower = 'abcdefghijklmnopqrstuvwxyz';
  const charsetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charsetNumbers = '0123456789';
  const charsetSpecial = '!@#$%^&*()';

  for (let i = 0; i < 3; i++) {
    let part = '';
    
    part += charsetLower[Math.floor(Math.random() * charsetLower.length)];
    part += charsetUpper[Math.floor(Math.random() * charsetUpper.length)];
    part += charsetNumbers[Math.floor(Math.random() * charsetNumbers.length)];
    part += charsetSpecial[Math.floor(Math.random() * charsetSpecial.length)];
    

    const allChars = charsetLower + charsetUpper + charsetNumbers + charsetSpecial;
    for (let j = 4; j < 6; j++) { 
      const randomIndex = Math.floor(Math.random() * allChars.length);
      part += allChars[randomIndex];
    }
    parts.push(part);
  }

  const generatedPassword = `${parts[0]}-${parts[1]}-${parts[2]}`;

  this.password = generatedPassword;
  this.data.password = generatedPassword;  

  this.checkPasswordStrength();
}

  
openWebsite(url: string): void {
  // Überprüfe, ob die URL ein Protokoll enthält (http:// oder https://)
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url; // Füge 'https://' hinzu, wenn es fehlt
  }

  // Öffne die Webseite in einem neuen Tab mit noreferrer und noopener
  window.open(url, '_blank', 'noopener,noreferrer');
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
