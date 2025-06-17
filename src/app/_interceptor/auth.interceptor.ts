import { HttpInterceptorFn } from '@angular/common/http';
import { CommonFunctionService } from '../_services/common-function.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token') ?? '';

  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(authReq);
};
