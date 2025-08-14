import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { CommonFunctionService } from '../_services/common-function.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const commonFunctionService = inject(CommonFunctionService);
  let goto = route.queryParamMap.get('goto') ?? '';
  const token = commonFunctionService.getDecryptData(decodeURIComponent(goto));
  const token_1 = commonFunctionService.getDecryptData(token);

  const user = localStorage.getItem('user') ?? ''
  const token_2 = commonFunctionService.getDecryptData(user); 

  if (state.url === '/login') {
    return true;
  }

  if (token_1 != null && token_1 == token_2 && token_2 != null) {
    return true;
  }

  // Else clear and redirect
  localStorage.clear();
  router.navigate(['/login']);
  return false;

};