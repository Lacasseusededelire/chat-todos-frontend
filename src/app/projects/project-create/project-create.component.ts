import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Router, RouterModule } from '@angular/router'; // Ajout de RouterModule
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterModule, // Ajout pour navigation avec Router
  ],
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent {
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      language: ['fr', Validators.required],
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.projectService.createProject(this.projectForm.value).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          console.error('Erreur lors de la création du projet', err);
          // Optionnel : affiche un message à l’utilisateur
        },
      });
    }
  }
}