import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './task-create-user.component.html',
  styleUrls: ['./task-create-user.component.scss'],
})
export class TaskCreateUserComponent implements OnInit {
  taskForm: FormGroup;
  projects: any[] = [];
  currentUserId: number | null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      projectId: [null, Validators.required],
    });
    this.currentUserId = this.authService.getCurrentUserId();
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.http.get<any[]>('http://localhost:3000/projects').subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err: any) => console.error('Erreur chargement projets:', err),
    });
  }

  onSubmit() {
    if (this.taskForm.valid && this.currentUserId !== null) {
      const taskData = {
        ...this.taskForm.value,
        assignedToId: this.currentUserId, // Assigné automatiquement à l'utilisateur connecté
      };
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.router.navigate(['/user-tasks']);
        },
        error: (err: any) => console.error('Erreur création tâche:', err),
      });
    } else {
      console.warn('Formulaire invalide ou utilisateur non connecté');
    }
  }

  cancel() {
    this.router.navigate(['/user-tasks']);
  }
}