import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterTaskComponent } from './components/register-task/register-task.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { UpdateTaskComponent } from './components/update-task/update-task.component';

const routes: Routes = [
  { path: '', component: TasksComponent },
  { path: 'register-task', component: RegisterTaskComponent },
  { path: 'update-task/:id', component: UpdateTaskComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
