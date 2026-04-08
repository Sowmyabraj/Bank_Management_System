import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  console.log('TOKEN:', sessionStorage.getItem('token'));
  if (auth.isLoggedIn()) {
    return true;
  } else {
    console.log('REDIRECTING TO LOGIN'); 
    router.navigate(['/login']);
    return false;
  }
};