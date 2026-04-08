import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit, OnDestroy {

  form!: FormGroup;
  error: string | null = null;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

 login(): void {
  if (this.form.invalid || this.isLoading) {
    this.form.markAllAsTouched();
    return;
  }

  this.error = null;
  this.isLoading = true;

  const email = this.form.value.email?.trim();
  const password = this.form.value.password?.trim();

  this.auth.login(email, password)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.isLoading = false;

        this.auth.saveToken(res.token);
        this.cdr.detectChanges();
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {

  this.isLoading = false;
  this.error = err?.message || 'Login failed';
  this.cdr.detectChanges();
}
    });
}
get email() {
  return this.form.get('email');
}

get password() {
  return this.form.get('password');
}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}