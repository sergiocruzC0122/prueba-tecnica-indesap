import { Routes } from '@angular/router';
import { TimerComponent } from './feature/timer/timer';
import { TableTimerComponent } from './feature/table-timer/table-timer';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: TimerComponent
  },
  {
    path: 'timer-table',
    component: TableTimerComponent
  },
  {
    path: '**',
    redirectTo: '/inicio'
  },
];
