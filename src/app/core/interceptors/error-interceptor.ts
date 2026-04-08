import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    catchError((error) => {

      let normalizedError = {
        code: 'UNKNOWN',
        message: 'Something went wrong. Please try again.'
      };

      // 🔴 Handle HTTP status
      if (error.status === 0) {
        normalizedError = {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect. Check your internet.'
        };
      }

      else if (error.status === 401) {
        normalizedError = {
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials.'
        };
      }

      else if (error.status === 404) {
        normalizedError = {
          code: 'NOT_FOUND',
          message: 'Requested resource not found.'
        };
      }

      else if (error.status >= 500) {
        normalizedError = {
          code: 'SERVER_ERROR',
          message: 'Server error. Please try later.'
        };
      }

      // 🔴 Handle custom errors (like login validation)
      if (error?.message) {
        normalizedError.message = error.message;
      }

      return throwError(() => normalizedError);
    })
  );
};