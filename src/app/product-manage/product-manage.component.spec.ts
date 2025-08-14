import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductManageComponent } from './product-manage.component';
import { ProductService } from '../_services/product/product.service';
import { CommonFunctionService } from '../_services/common-function.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ProductManageComponent', () => {
  let component: ProductManageComponent;
  let fixture: ComponentFixture<ProductManageComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let commonFunctionServiceSpy: jasmine.SpyObj<CommonFunctionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: '100',
    category: 'Test Category'
  };

  let activatedRouteSpy: any;

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj<ProductService>('ProductService', ['registerProduct', 'updateProduct', 'getProductByID']);
    const commonFuncSpy = jasmine.createSpyObj<CommonFunctionService>('CommonFunctionService', ['getEncryptRoute']);
    const routerSpyObj = jasmine.createSpyObj<Router>('Router', ['navigate']);
    // Mutable spy for ActivatedRoute
    activatedRouteSpy = {
      snapshot: {
        queryParamMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProductManageComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: CommonFunctionService, useValue: commonFuncSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductManageComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    commonFunctionServiceSpy = TestBed.inject(CommonFunctionService) as jasmine.SpyObj<CommonFunctionService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default spy behaviors
    productServiceSpy.registerProduct.and.returnValue(of({ status: 200 }));
    productServiceSpy.updateProduct.and.returnValue(of({ status: 200 }));
    productServiceSpy.getProductByID.and.returnValue(of({ status: 200, data: [mockProduct] }));
    commonFunctionServiceSpy.getEncryptRoute.and.returnValue('encrypted-route');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should create a form with required controls', () => {
      expect(component.productForm.contains('name')).toBeTrue();
      expect(component.productForm.contains('description')).toBeTrue();
      expect(component.productForm.contains('price')).toBeTrue();
      expect(component.productForm.contains('category')).toBeTrue();
    });

    it('should make name control required', () => {
      const control = component.productForm.get('name');
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
    });
  });

  describe('onSubmit', () => {
    it('should not call registerProduct when form is invalid', () => {
      component.onSubmit();
      expect(productServiceSpy.registerProduct).not.toHaveBeenCalled();
    });

    it('should call registerProduct when form is valid and id does not exist', () => {
      component.productForm.patchValue({
        name: 'New Product',
        description: 'New Description',
        price: '200',
        category: 'New Category'
      });
      
      component.onSubmit();
      
      expect(productServiceSpy.registerProduct).toHaveBeenCalledWith(component.productForm.value);
    });

    it('should call updateProduct when form is valid and id exists', () => {
      component.idExist = true;
      component.productForm.patchValue({
        id: 1,
        name: 'Updated Product',
        description: 'Updated Description',
        price: '300',
        category: 'Updated Category'
      });
      
      component.onSubmit();
      
      expect(productServiceSpy.updateProduct).toHaveBeenCalled();
    });

    it('should navigate to product-list on successful registration', fakeAsync(() => {
      component.productForm.patchValue({
        name: 'New Product',
        description: 'New Description',
        price: '200',
        category: 'New Category'
      });
      
      component.onSubmit();
      tick();
      
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/product-list'], 
        { queryParams: { goto: 'encrypted-route' } });
    }));
  });

  describe('getProductByID', () => {
    it('should load product data when id exists', () => {
      // Arrange
      const productId = 1;
      
      // Act
      component.getProductByID(productId);
      
      // Assert
      expect(productServiceSpy.getProductByID).toHaveBeenCalledWith(productId);
      expect(component.productForm.value.name).toBe(mockProduct.name);
    });
  });

  describe('ngOnInit', () => {
    it('should load product data when id is present in route', () => {
      // Arrange
      activatedRouteSpy.snapshot.queryParamMap.get.and.returnValue('1');
      
      // Act
      component.ngOnInit();
      
      // Assert
      expect(component.idExist).toBeTrue();
      expect(productServiceSpy.getProductByID).toHaveBeenCalledWith(1);
    });

    it('should not load product data when id is not present in route', () => {
      // Arrange
      activatedRouteSpy.snapshot.queryParamMap.get.and.returnValue(null);
      
      // Act
      component.ngOnInit();
      
      // Assert
      expect(component.idExist).toBeFalse();
      expect(productServiceSpy.getProductByID).not.toHaveBeenCalled();
    });
  });
});
