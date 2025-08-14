import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../_services/product/product.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from '../_services/common-function.service';

@Component({
  selector: 'app-product-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-manage.component.html',
  styleUrl: './product-manage.component.css'
})
export class ProductManageComponent implements OnInit {
  router = inject(Router)
  route = inject(ActivatedRoute)

  fb = inject(FormBuilder);
  productService = inject(ProductService);
  commonFunctionService = inject(CommonFunctionService);

  idExist: boolean = false;


  productForm: FormGroup = this.fb.group({
    id: [{ value: '', disabled: true }, [Validators.required]],
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required]],
    category: ['', [Validators.required]]
  });


  get f() {
    return this.productForm.controls;
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.idExist) {
        let value =  this.productForm.getRawValue(); 
        this.productService.updateProduct(value).subscribe(res => {
          if (res.status === 200) {
            console.log("Successfully Updated");
            this.navigateTo('/product-list');
          } else {
            console.error("Due to connection error, Something went wrong. Please try after some time");
          }
        }, error => {
          console.error("Due to connection error, Something went wrong. Please try after some time");
        })
      } else {
        this.productService.registerProduct(this.productForm.value).subscribe(res => {
          if (res.status === 200) {
            console.log("Successfully submitted");
            this.navigateTo('/product-list');
          } else {
            console.error("Due to connection error, Something went wrong. Please try after some time");
          }
        }, error => {
          console.error("Due to connection error, Something went wrong. Please try after some time");
        })
      }

    } else {
      console.error('Please fill the form');
    }
  }


  navigateTo(route: string) {
    let encryptData = this.commonFunctionService.getEncryptRoute();
    this.router.navigate([route], { queryParams: { goto: encryptData } });
  }

  getProductByID(id: number) {
    this.productService.getProductByID(id).subscribe(res => {
      if (res.status === 200) {
        this.productForm.patchValue(res.data[0]);
      } else {
        console.error("Due to connection error, Something went wrong. Please try after some time");
      }
    }, error => {
      console.error("Due to connection error, Something went wrong. Please try after some time");
    })
  }

  ngOnInit(): void {
    let id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.getProductByID(Number(id));
      this.idExist = true;
    }
  }


}
