import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getMyTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`);
  }

  getProjectTasks(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/project/${projectId}`);
  }

  createTask(task: { projectId: number; title: string; description: string; startDate: string; endDate: string; assignedToId?: number }): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  updateTask(id: number, update: Partial<any>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, update);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}