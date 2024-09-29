import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ColorChromeModule } from 'ngx-color/chrome'; // Beispiel: Chrome Picker
import { MatDividerModule } from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { CommonModule } from '@angular/common';  // Import CommonModule
import { MatProgressBarModule } from '@angular/material/progress-bar';  // Import MatProgressBarModule




@Component({
  selector: 'app-link-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    ColorChromeModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    CommonModule,
    MatProgressBarModule
  ],
  templateUrl: './link-dialog.component.html',
  styleUrls: ['./link-dialog.component.scss']
})
export class LinkDialogComponent {
  public link: string = ''; 
  public label: string = '';
  public password: string= '';
  public description: string = ''; 
  public username: string = ''; 
  public categories: string[] = ['Arbeit', 'SocialMedia', 'Privat', 'Sonstiges'];  
  public category: string = '';  
  public passwordStrength: number = 0;  
  public passwordStrengthDescription: string = 'Schwach';  
  
 
  
  constructor(public dialogRef: MatDialogRef<LinkDialogComponent>) {}

  public selectedColor: string = '#8800e0'; // Standardfarbe


  onSave(): void {
    if (this.link && this.label && this.password) {
      this.dialogRef.close({ 
        url: this.link, 
        label: this.label, 
        password: this.password,
        color: this.selectedColor, 
        description: this.description,
        username: this.username,
        category: this.category // Speichere die Kategorie
      });
      this.selectedColor = '#8800e0'; 
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Dialog wird geschlossen
    this.selectedColor = '#8800e0'; // Standardfarbe
  }

  // Function to calculate password strength
  checkPasswordStrength() {
    let strength = 0;
  
    // Check length
    if (this.password.length >= 8) {
      strength += 30; // Adjust to give more weight to length
    }
    if (this.password.length >= 12) {
      strength += 20; // Add bonus for extra length
    }
  
    // Check for uppercase, numbers, and special characters
    if (/[A-Z]/.test(this.password)) strength += 20;
    if (/\d/.test(this.password)) strength += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) strength += 15;
    if (/[a-z]/.test(this.password)) strength += 10;
  
    // Reduce penalty for repeated characters, if needed
    if (/(.)\1{2,}/.test(this.password)) strength -= 5;
  
    // Cap the strength to 100
    this.passwordStrength = Math.min(Math.max(strength, 0), 100);
  
    // Assign strength description
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
    
    // Ensure each part contains at least one of each type: lowercase, uppercase, number, special character
    part += charsetLower[Math.floor(Math.random() * charsetLower.length)];
    part += charsetUpper[Math.floor(Math.random() * charsetUpper.length)];
    part += charsetNumbers[Math.floor(Math.random() * charsetNumbers.length)];
    part += charsetSpecial[Math.floor(Math.random() * charsetSpecial.length)];
    
    // Fill the rest of the part with random characters from all charsets
    const allChars = charsetLower + charsetUpper + charsetNumbers + charsetSpecial;
    for (let j = 4; j < 6; j++) { // Already added 4 characters, fill the rest
      const randomIndex = Math.floor(Math.random() * allChars.length);
      part += allChars[randomIndex];
    }
    parts.push(part);
  }

  const generatedPassword = `${parts[0]}-${parts[1]}-${parts[2]}`;
  this.password = generatedPassword;  // Setze das generierte Passwort in das Eingabefeld

  // Immediately check the password strength after generation
  this.checkPasswordStrength();
}


  // Methode zum Aktualisieren der ausgewählten Farbe
  onColorChange(color: string): void {
    this.selectedColor = color;
  }


}
function checkPasswordStrength() {
  throw new Error('Function not implemented.');
}

