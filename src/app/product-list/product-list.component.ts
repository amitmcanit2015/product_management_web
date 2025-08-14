import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ProductService } from '../_services/product/product.service';
import { Router } from '@angular/router';
import { CommonFunctionService } from '../_services/common-function.service';
// import { NumberConverter } from 'ngx-number-converter-indian';
// import { SessionTimeout } from 'ngx-idle-browser';
// import { DateMonthConverter } from 'ngx-date-month-converter-indian';

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


  // private sessionTimeout: SessionTimeout;

  // constructor() {
  //   this.sessionTimeout = new SessionTimeout({
  //     warningDuration: 60000, // 1 minute
  //     onLogout: () => {
  //       // Handle logout
  //       console.log("logout");
        
  //       this.router.navigate(['/login']);
  //     },
  //     onWarning: () => {
  //       // Show warning modal
  //       // $('#loginTimerAlert').modal('show');
  //       console.log("warning");
        
  //     }
  //   });
  // }

  // @HostListener('click', ['$event'])
  // @HostListener('window:keydown', ['$event'])
  // @HostListener('window:wheel')
  // onActivity() {
  //   this.sessionTimeout.reset();
  // }

 
 public convertAmount(amount: number, language: string,region:string) {
}

ngOnInit(): void {
  this.getProductList();
  
  let amount = 123;
  let language:any = 'en';
  let region:any = 'india';


  // console.log( NumberConverter.convert(amount, language,region));
//     console.log(DateMonthConverter.convert(1, 'en', 'date')); // "First"
// console.log(DateMonthConverter.convert(1, 'hi', 'date')); // "एक"
// console.log(DateMonthConverter.convert(31, 'en', 'date')); // "Thirty-first"
// console.log(DateMonthConverter.convert(31, 'hi', 'date')); // "इकत्तीस"

// // Month conversions
// console.log(DateMonthConverter.convert(1, 'en', 'month')); // "January"
// console.log(DateMonthConverter.convert(1, 'hi', 'month')); // "जनवरी"
// console.log(DateMonthConverter.convert(12, 'en', 'month')); // "December"
// console.log(DateMonthConverter.convert(12, 'hi', 'month')); // "दिसंबर"


  }

}
