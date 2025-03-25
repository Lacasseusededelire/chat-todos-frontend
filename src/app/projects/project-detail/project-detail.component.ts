import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Ajout de RouterModule
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';
import { ChatRoomComponent } from '../../chat/chat-room/chat-room.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule, // Ajout pour navigation
    TaskListComponent,
    ChatRoomComponent,
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  project: any;
  tasks: any[] = [];
  inviteForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    private fb: FormBuilder,
  ) {
    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.projectService.getProject(id).subscribe({
      next: (data) => {
        this.project = data;
        this.tasks = data.tasks || []; // Les tâches viennent avec le projet
      },
      error: (err) => console.error('Erreur lors du chargement du projet', err),
    });
    // Suppression de l’appel redondant à taskService.getProjectTasks(id)
  }

  inviteUser() {
    if (this.inviteForm.valid) {
      this.projectService.inviteUser(this.project.id, this.inviteForm.value.email).subscribe({
        next: () => {
          this.inviteForm.reset();
          // Optionnel : recharge le projet pour mettre à jour les utilisateurs si nécessaire
        },
        error: (err) => console.error('Erreur lors de l’invitation', err),
      });
    }
  }
}