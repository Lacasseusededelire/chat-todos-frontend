import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table'; // Ajout pour MatTable
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatTableModule, // Ajout pour la table
    RouterModule,
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  invitations: any[] = [];
  displayedColumns: string[] = ['projectName', 'inviterEmail', 'status', 'actions']; // Colonnes de la table

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
    this.loadInvitations();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => console.error('Erreur lors du chargement des projets', err),
    });
  }

  loadInvitations() {
    this.projectService.getInvitations().subscribe({
      next: (invitations) => {
        this.invitations = invitations;
      },
      error: (err) => console.error('Erreur lors du chargement des invitations', err),
    });
  }

  respondToInvitation(invitationId: number, accept: boolean) {
    this.projectService.respondToInvitation(invitationId, accept).subscribe({
      next: () => {
        console.log(`Invitation ${invitationId} ${accept ? 'acceptée' : 'refusée'}`);
        this.loadInvitations(); // Recharge les invitations pour mettre à jour le statut
        this.loadProjects(); // Recharge les projets au cas où un projet est ajouté
      },
      error: (err) => console.error('Erreur lors de la réponse à l’invitation', err),
    });
  }
}