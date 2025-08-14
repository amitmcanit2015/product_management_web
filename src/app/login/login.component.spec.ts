import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../_services/login/login.service';
import { CommonFunctionService } from '../_services/common-function.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let commonFunctionServiceSpy: jasmine.SpyObj<CommonFunctionService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let localStorageSetItemSpy: jasmine.Spy;

  beforeEach(async () => {
    const loginSpy = jasmine.createSpyObj<LoginService>('LoginService', ['login']);
    const commonFuncSpy = jasmine.createSpyObj<CommonFunctionService>('CommonFunctionService', ['getEncryptedData', 'getEncryptRoute']);
    const routerSpyObj = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: loginSpy },
        { provide: CommonFunctionService, useValue: commonFuncSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    commonFunctionServiceSpy = TestBed.inject(CommonFunctionService) as jasmine.SpyObj<CommonFunctionService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    localStorageSetItemSpy = spyOn(localStorage, 'setItem');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form validation', () => {
    it('should be invalid when empty', () => {
      expect(component.loginForm.valid).toBeFalse();
    });
    it('should require email and password', () => {
      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');
      email?.setValue('');
      password?.setValue('');
      expect(email?.hasError('required')).toBeTrue();
      expect(password?.hasError('required')).toBeTrue();
    });
    it('should require valid email format', () => {
      const email = component.loginForm.get('email');
      email?.setValue('notanemail');
      expect(email?.hasError('email')).toBeTrue();
    });
    it('should require password of minimum length 6', () => {
      const password = component.loginForm.get('password');
      password?.setValue('123');
      expect(password?.hasError('minlength')).toBeTrue();
    });
    it('should be valid with correct values', () => {
      component.loginForm.setValue({ email: 'test@email.com', password: '123456' });
      expect(component.loginForm.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('should not call login service if form is invalid', () => {
      component.loginForm.setValue({ email: '', password: '' });
      component.onSubmit();
      expect(loginServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should call login service if form is valid', () => {
      component.loginForm.setValue({ email: 'test@email.com', password: '123456' });
      loginServiceSpy.login.and.returnValue(of({ status: 200, token: 'abc', data: { user: 'testUser' } }));
      commonFunctionServiceSpy.getEncryptedData.and.returnValue('encryptedUser');
      commonFunctionServiceSpy.getEncryptRoute.and.returnValue('encryptedRoute');
      component.onSubmit();
      expect(loginServiceSpy.login).toHaveBeenCalledWith({ email: 'test@email.com', password: '123456' });
    });

    it('should store token and user, and navigate on successful login', fakeAsync(() => {
      component.loginForm.setValue({ email: 'test@email.com', password: '123456' });
      loginServiceSpy.login.and.returnValue(of({ status: 200, token: 'abc', data: { user: 'testUser' } }));
      commonFunctionServiceSpy.getEncryptedData.and.returnValue('encryptedUser');
      commonFunctionServiceSpy.getEncryptRoute.and.returnValue('encryptedRoute');
      component.onSubmit();
      tick();
      expect(localStorageSetItemSpy).toHaveBeenCalledWith('token', 'abc');
      expect(localStorageSetItemSpy).toHaveBeenCalledWith('user', 'encryptedUser');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/product-list'], { queryParams: { goto: 'encryptedRoute' } });
    }));

    it('should log error if login fails with status !== 200', fakeAsync(() => {
      spyOn(console, 'error');
      component.loginForm.setValue({ email: 'test@email.com', password: '123456' });
      loginServiceSpy.login.and.returnValue(of({ status: 400 }));
      component.onSubmit();
      tick();
      expect(console.error).toHaveBeenCalled();
    }));

    it('should log error if login service throws error', fakeAsync(() => {
      spyOn(console, 'error');
      component.loginForm.setValue({ email: 'test@email.com', password: '123456' });
      loginServiceSpy.login.and.returnValue(throwError(() => new Error('Network error')));
      component.onSubmit();
      tick();
      expect(console.error).toHaveBeenCalled();
    }));

    it('should log error if form is invalid', () => {
      spyOn(console, 'error');
      component.loginForm.setValue({ email: '', password: '' });
      component.onSubmit();
      expect(console.error).toHaveBeenCalledWith('Please fill the form');
    });
  });
});

