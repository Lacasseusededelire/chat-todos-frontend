import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
  template: `
    <h2 mat-dialog-title>Confirmer la suppression</h2>
    <mat-dialog-content>
      Es-tu sûr de vouloir supprimer cette tâche ?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Supprimer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      color: #666;
    }

    mat-dialog-content {
      padding: 20px;
      color: #666;
    }

    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    button[mat-raised-button] {
      &.mat-warn {
        background-color: #f5c6cb;
      }
    }
  `],
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}