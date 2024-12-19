import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { error } from 'console';
import { stat } from 'fs';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  displayedColumns: string[] = ['name','categoryName','description','price','edit'];
  dataSource:any;
  //length:any;
  responsemessage:any;

  constructor(private productService:ProductService,
    private ngxService: NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService: SnackbarService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.productService.getProducts().subscribe((res:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(res);
    },(err)=>{
      this.ngxService.stop();
      console.log(err.error.message);
      if(err.error?.message){
        this.responsemessage = err.error?.message;
      } else {
        this.responsemessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstants.error);
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width="850px";
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })

    const sub = dialogRef.componentInstance.onAddProduct.subscribe((res)=>{
      this.tableData();
    })
  }

  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    };
    dialogConfig.width="850px";
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })

    const sub = dialogRef.componentInstance.onEditProduct.subscribe((res)=>{
      this.tableData();
    })
  }

  handleDeleteAction(value:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete'+value.name+' product',
      confirmation:true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
      this.ngxService.start();
      this.deleteProduct(value.id);
      dialogRef.close();
    })
  }

  deleteProduct(id:any){
    this.productService.delete(id).subscribe((res:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responsemessage = res?.message;
      this.snackbarService.openSnackBar(this.responsemessage,"success");
    },(err)=>{
      this.ngxService.stop();
      console.log(err.error.message);
      if(err.error?.message){
        this.responsemessage = err.error?.message;
      } else {
        this.responsemessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstants.error);
    })
  }

  onChange(status:any, id:any){
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id:id
    }

    this.productService.updateStatus(data).subscribe((res:any)=>{
      this.ngxService.stop();
      this.responsemessage = res?.message;
      this.snackbarService.openSnackBar(this.responsemessage,"success");
    },(err)=>{
      this.ngxService.stop();
      console.log(err.error.message);
      if(err.error?.message){
        this.responsemessage = err.error?.message;
      } else {
        this.responsemessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstants.error);
    })
  }

}
