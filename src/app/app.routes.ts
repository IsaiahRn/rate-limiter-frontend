import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { PoliciesComponent } from './features/policies/policies.component';
import { SimulatorComponent } from './features/simulator/simulator.component';

import { landingGuard } from './core/guards/landing.guard';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', canActivate: [landingGuard], pathMatch: 'full', children: [] },

  { path: 'login', component: LoginComponent },

  {
    path: 'policies',
    component: PoliciesComponent,
    canActivate: [authGuard, roleGuard('ADMIN')]
  },
  {
    path: 'simulator',
    component: SimulatorComponent,
    canActivate: [authGuard, roleGuard('CLIENT')]
  },

  { path: '**', redirectTo: '' }
];
