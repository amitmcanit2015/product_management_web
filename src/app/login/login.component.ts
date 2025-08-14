import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../_services/login/login.service';
import { CommonFunctionService } from '../_services/common-function.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  router = inject(Router);
  fb = inject(FormBuilder);
  loginService = inject(LoginService);
  commonFunctionService = inject(CommonFunctionService);
  translate = inject(TranslateService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loginError?: string;
  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe((res: any) => {
        if (res.status === 200) {
          // let token = this.commonFunctionService.getEncryptedData(res["token"]);
          localStorage.setItem("token", res["token"]);
          let user = this.commonFunctionService.getEncryptedData(res["data"]["user"]);
          localStorage.setItem("user", user);

          let encryptData = this.commonFunctionService.getEncryptRoute();

          this.router.navigate(['/product-list'], { queryParams: { goto: encryptData } })
        } else {
          this.loginError = 'Invalid credentials';
        }
      }, error => {
        console.error("Due to connection error, Something went wrong. Please try after some time");
        this.loginError = 'Invalid credentials';
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginError = 'Please fill the form';
    }
  }

  // Convenience getter for easy access in template
  get f() {
    return this.loginForm.controls;
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }


  ngOnInit(): void {
    this.translate.use('en');
  }

}
