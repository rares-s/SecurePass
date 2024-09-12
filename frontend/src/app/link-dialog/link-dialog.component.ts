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
    CommonModule
  ],
  templateUrl: './link-dialog.component.html',
  styleUrls: ['./link-dialog.component.scss']
})
export class LinkDialogComponent {
  public link: string = ''; 
  public label: string = '';
  public password: string= '';
  public description: string = ''; // Beschreibung hinzufügen
  public username: string = ''; // Username hinzufügen
  public categories: string[] = ['Arbeit', 'SocialMedia', 'Privat', 'Sonstiges'];  // Add this array for categories
  public category: string = '';  // Add a binding for the selected category
  
 
  
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
  this.password = generatedPassword;  // Setze das generierte Passwort in das Eingabefeld
}

  // Methode zum Aktualisieren der ausgewählten Farbe
  onColorChange(color: string): void {
    this.selectedColor = color;
  }


}
