import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RateLimiterComponent } from './features/rate-limiter/rate-limiter.component';

const routes: Routes = [
  { path: '', component: RateLimiterComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
