import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthService, AuthState } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  authState$: Observable<AuthState> = this.auth.authState$;

  isLoginRoute = false;
  menuOpen = false;

  constructor() {
    this.isLoginRoute = this.router.url.startsWith('/login');

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isLoginRoute = e.urlAfterRedirects.startsWith('/login');
        this.menuOpen = false;
      });
  }

  getInitials(state: AuthState): string {
    const u = (state.username || '').trim();
    if (!u) return 'U';
    return u.slice(0, 2).toUpperCase();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.menuOpen = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    const target = ev.target as HTMLElement | null;
    if (!target) return;
    if (target.closest('.profile')) return;
    this.menuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.menuOpen = false;
  }
}
