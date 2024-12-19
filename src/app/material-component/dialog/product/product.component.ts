import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import { CategoryComponent } from '../category/category.component';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { error } from 'console';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction: any = "Add";
  action:any = "Add";
  responsemessage:any;
  categories:any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private productService:ProductService,
  public dialogRef:MatDialogRef<ProductComponent>,
  private categoryService:CategoryService,
  private snackbarService:SnackbarService,
  private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      categoryid:[null,[Validators.required]],
      price:[null,[Validators.required]],
      description:[null,[Validators.required]]
    })

    if(this.dialogData.action === "Edit"){
      this.dialogAction="Edit";
      this.action="Update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategory();
  }

  getCategory(){
    this.categoryService.getCategory().subscribe((resp:any)=>{
      this.categories = resp;
    },(error)=>{
      if(error.error?.message){
        this.responsemessage = error.error?.message;
      } else {
        this.responsemessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstants.error);
    })
  }

  handleSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit();
    } else {
      this.add();
    }
  }

  add(){
    var formData= this.productForm.value;
    var data = {
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }

    this.productService.add(data).subscribe((res:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responsemessage= res.message;
      this.snackbarService.openSnackBar(this.responsemessage,"Success");
    },(error)=>{
      if(error.error?.message){
        this.responsemessage = error.error?.message;
      } else {
        this.responsemessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstants.error);
    })
  }

  edit(){
    var formData= this.productForm.value;
    var data = {
      id:this.dialogData.data.id,
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }
    this.productService.update(data).subscribe((res:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responsemessage= res.message;
      this.snackbarService.openSnackBar(this.responsemessage,"Success");
    },(error)=>{
      if(error.error?.message){
        this.responsemessage = error.error?.message;
      } else {
        this.responsemessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstants.error);
    })
  }

}
