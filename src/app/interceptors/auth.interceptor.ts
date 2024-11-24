import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService, LocalKeys, LocalManagerService } from '../services';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const localManager = inject(LocalManagerService);
  const authService = inject(AuthService);


  const token = localManager.getElement(LocalKeys.accessToken);

  let headers = req.headers.set('Content-Type', 'application/json');

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);

  }

  const authReq = req.clone({ headers });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 || error.status === 403) {
        return authService.refreshToken().pipe(

          switchMap((newToken: string) => {
            localManager.setElement(LocalKeys.accessToken, newToken)
            const updatedHeaders = req.headers.set(
              "Authorization",
              `Bearer ${newToken}`
            )
            const newRequest = req.clone({ headers: updatedHeaders })
            return next(newRequest)
          }
          ),
          // Lo siguiente es opcional, si se quiere hacer logout en caso de error
          // catchError(refreshError => {
          //   authService.logout();
          //   return throwError(() => refreshError)
          // })
        )
      }
      return throwError(() => error)
    }
    )
  );
};
