import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory =  new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any= FormGroup;
  dialogAction :any = "Add";
  action:any = "Add";

  responseMessage:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private formbuilder:FormBuilder,
    private categoryService:CategoryService,
    public dialogRef:MatDialogRef<CategoryComponent>,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.formbuilder.group({
      name:[null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update"
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }
  
  handleSubmit(){
    if(this.dialogAction === "Edit"){
      this.Edit();
    } else {
      this.Add();
    }
  }

  Add(){
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name,
    }

    this.categoryForm.add(data).subscribe((res:any)=>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = res.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Success")
    },(error:any)=>{
      this.dialogRef.close();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  Edit(){
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name,
      id: this.dialogData.id
    }

    this.categoryForm.update(data).subscribe((res:any)=>{
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = res.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Success")
    },(error:any)=>{
      this.dialogRef.close();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

}
