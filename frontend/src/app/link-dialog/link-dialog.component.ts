import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';



@Component({
  selector: 'app-link-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule
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
}
