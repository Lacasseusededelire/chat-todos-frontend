import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createProject(project: { name: string; price: number; language: string }): Observable<any> {
    return this.http.post(this.apiUrl, project);
  }

  getProject(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  inviteUser(projectId: number, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/invite`, { email });
  }

  respondToInvitation(invitationId: number, accept: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/invitations/${invitationId}/respond`, { accept });
  }

  getInvitations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invitations`);
  }
}