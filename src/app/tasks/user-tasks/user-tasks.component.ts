import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog.component';

@Component({
  selector: 'app-user-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss'],
})
export class UserTasksComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'startDate', 'endDate', 'status', 'project', 'assignedTo', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  tasks: any[] = [];
  projects: any[] = [];
  statuses = ['nouvelle', 'en cours', 'terminée', 'en retard', 'annulée'];
  selectedStatus: string | null = null;
  selectedProject: number | null = null;
  searchQuery: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog // Ajout de MatDialog
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.loadProjects();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadTasks() {
    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: (err: any) => console.error('Erreur chargement tâches:', err),
    });
  }

  loadProjects() {
    this.http.get<any[]>('http://localhost:3000/projects').subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err: any) => console.error('Erreur chargement projets:', err),
    });
  }

  applyFilters() {
    let filteredTasks = this.tasks;

    if (this.selectedStatus) {
      filteredTasks = filteredTasks.filter(task => task.status === this.selectedStatus);
    }

    if (this.selectedProject) {
      filteredTasks = filteredTasks.filter(task => task.project?.id === this.selectedProject);
    }

    if (this.searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.dataSource.data = filteredTasks;
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  editTask(taskId: number) {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  deleteTask(taskId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://localhost:3000/tasks/${taskId}`).subscribe({
          next: () => {
            this.loadTasks();
          },
          error: (err: any) => console.error('Erreur suppression tâche:', err),
        });
      }
    });
  }

  generatePlanning() {
    const tasksForPlanning = this.dataSource.data.map(task => ({
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
      project: task.project?.name,
      assignedTo: task.assignedTo?.username || 'Non assigné',
    }));

    this.http.post('http://localhost:3000/chat/generate-planning', { tasks: tasksForPlanning }, { responseType: 'text' }).subscribe({
      next: (planningText: string) => {
        console.log('Planning reçu:', planningText); // Log pour déboguer
        const blob = new Blob([planningText], { type: 'text/plain' });
        saveAs(blob, 'planning.txt');
      },
      error: (err: any) => {
        console.error('Erreur génération planning:', err);
        alert('Erreur lors de la génération du planning. Vérifiez votre connexion au serveur.');
      },
    });
  }
 
  sendTaskToChat(taskId: number) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      console.error('Tâche non trouvée:', taskId);
      return;
    }
  
    this.http.get<any>(`http://localhost:3000/projects/${task.project.id}`).subscribe({
      next: (project) => {
        const chat = project.chats.find((c: any) => c.name.includes('Général'));
        if (!chat) {
          console.error('Chat général non trouvé pour le projet:', task.project.id);
          return;
        }
  
        const content = `Tâche : ${task.title || 'Sans titre'}\nDescription : ${task.description || 'N/A'}`;
        if (!content.trim()) {
          console.error('Le contenu du message ne peut pas être vide');
          return;
        }
  
        // Changer "message" en "content" pour correspondre au backend
        this.http.post(`http://localhost:3000/chat/${chat.id}/message`, { content, taskId }).subscribe({
          next: () => {
            console.log('Tâche envoyée dans le chat:', chat.id);
            this.router.navigate(['/chat', chat.id]);
          },
          error: (err) => console.error('Erreur envoi tâche dans le chat:', err),
        });
      },
      error: (err) => console.error('Erreur chargement projet:', err),
    });
  }
}