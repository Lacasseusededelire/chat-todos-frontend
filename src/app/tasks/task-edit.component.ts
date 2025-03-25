import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <div class="container">
      <h1>Modifier la Tâche</h1>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date de début</mat-label>
          <input matInput type="date" formControlName="startDate">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date de fin</mat-label>
          <input matInput type="date" formControlName="endDate">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status">
            <mat-option value="nouvelle">Nouvelle</mat-option>
            <mat-option value="en cours">En cours</mat-option>
            <mat-option value="terminée">Terminée</mat-option>
            <mat-option value="en retard">En retard</mat-option>
            <mat-option value="annulée">Annulée</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="actions">
          <button mat-raised-button color="primary" type="submit">Enregistrer</button>
          <button mat-raised-button color="warn" type="button" (click)="cancel()">Annuler</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #f5f5f5;
    }

    h1 {
      color: #666;
      text-align: center;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    .actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    button[mat-raised-button] {
      &.mat-primary {
        background-color: #aec6cf;
      }

      &.mat-warn {
        background-color: #f5c6cb;
      }
    }
  `],
})
export class TaskEditComponent implements OnInit {
  taskForm: FormGroup;
  taskId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.taskId = +this.route.snapshot.paramMap.get('id')!;
    this.loadTask();
  }

  loadTask() {
    this.http.get(`http://localhost:3000/tasks/${this.taskId}`).subscribe({
      next: (task: any) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          startDate: task.startDate.split('T')[0],
          endDate: task.endDate.split('T')[0],
          status: task.status,
        });
      },
      error: (err) => console.error('Erreur chargement tâche:', err),
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe({
        next: () => {
          this.router.navigate(['/user-tasks']);
        },
        error: (err) => console.error('Erreur mise à jour tâche:', err),
      });
    }
  }

  cancel() {
    this.router.navigate(['/user-tasks']);
  }
}