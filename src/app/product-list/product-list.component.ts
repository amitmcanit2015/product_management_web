import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../_services/product/product.service';
import { Router } from '@angular/router';
import { CommonFunctionService } from '../_services/common-function.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  router = inject(Router)
  productService = inject(ProductService);
  commonFunctionService = inject(CommonFunctionService);


  productList: any[] = []


  getProductDetails(item: any) {
    let encryptData = this.commonFunctionService.getEncryptRoute();
    this.router.navigate(['/product-manage'], { queryParams: { goto: encryptData,id:item.id } });
  }

  navigateTo(route: string) {
    let encryptData = this.commonFunctionService.getEncryptRoute();
    this.router.navigate([route], { queryParams: { goto: encryptData } });
  }

  getProductList() {
    this.productService.getProductList().subscribe(res => {
      if (res.status === 200) {
          this.productList = res.data;
      } else {
        console.error("Due to connection error, Something went wrong. Please try after some time");
      }
    }, error => {
      console.error("Due to connection error, Something went wrong. Please try after some time");
    })
  }
  deleteProduct(item:any) {
    this.productService.deleteProduct(item.id).subscribe(res => {
      if (res.status === 200) {
          console.log("Successfully Deleted");
          this.getProductList();
      } else {
        console.error("Due to connection error, Something went wrong. Please try after some time");
      }
    }, error => {
      console.error("Due to connection error, Something went wrong. Please try after some time");
    })
  }



  ngOnInit(): void {
    this.getProductList();
  }

}
