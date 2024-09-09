import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-link-detail-dialog',
  templateUrl: './link-detail.dialog.component.html',
  styleUrls: ['./link-detail.dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LinkDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LinkDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string; label: string; password: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
