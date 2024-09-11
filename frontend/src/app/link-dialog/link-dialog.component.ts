import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';




@Component({
  selector: 'app-link-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './link-dialog.component.html',
  styleUrls: ['./link-dialog.component.scss']
})
export class LinkDialogComponent {
  public link: string = ''; 
  public label: string = '';
  public password: string= '';
 
  
  constructor(public dialogRef: MatDialogRef<LinkDialogComponent>) {}

  onSave(): void {
    if (this.link && this.label && this.password) {
      this.dialogRef.close({ url: this.link, label: this.label, password: this.password });
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Dialog wird geschlossen
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


}
