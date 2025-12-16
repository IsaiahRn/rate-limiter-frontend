// @ts-nocheck

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

function asAnyExpect() {
  return (expect as unknown) as any;
}

class AuthServiceStub {
  login() { return of({ username: 'admin', role: 'ADMIN' }); }
}

describe('LoginComponent', () => {
  it('creates', async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useClass: AuthServiceStub }]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    asAnyExpect()(fixture.componentInstance).toBeTruthy();
  });
});
