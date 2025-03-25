import { Component, Input } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatSelectModule, MatButtonModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  @Input() tasks: any[] = [];
  @Input() projectId?: number;

  constructor(private taskService: TaskService) {}

  updateTask(taskId: number, status: string) {
    this.taskService.updateTask(taskId, { status }).subscribe(() => {
      this.tasks = this.tasks.map(t => t.id === taskId ? { ...t, status } : t);
    });
  }
}