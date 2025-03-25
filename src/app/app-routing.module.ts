import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectCreateComponent } from './projects/project-create/project-create.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { UserTasksComponent } from './tasks/user-tasks/user-tasks.component';
import { TaskEditComponent } from './tasks/task-edit.component';
import { TaskCreateUserComponent } from './tasks/task-create-user/task-create-user.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard] },
  { path: 'projects/create', component: ProjectCreateComponent, canActivate: [AuthGuard] },
  { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [AuthGuard] },
  { path: 'tasks/create/:projectId', component: TaskCreateComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'user-tasks', component: UserTasksComponent, canActivate: [AuthGuard] },
  { path: 'tasks/edit/:id', component: TaskEditComponent, canActivate: [AuthGuard] },
  { path: 'tasks/create', component: TaskCreateComponent, canActivate: [AuthGuard] },
  { path: 'tasks/user-create', component: TaskCreateUserComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' },
  
];