import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token =localStorage.getItem('token');

  let headers = req.headers.set('Content-Type', 'application/json');

  if (token){
    headers=headers.set('Authorization', `Bearer ${token}`);

  }
  return next(req);
};
