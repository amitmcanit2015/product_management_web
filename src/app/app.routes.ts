import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductManageComponent } from './product-manage/product-manage.component';
import { authGuard } from './_gaurd/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full' // Important: ensures exact match of the empty path
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'product-list',
        component: ProductListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'product-manage',
        component: ProductManageComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login' // Wildcard fallback for undefined routes
    }
];
