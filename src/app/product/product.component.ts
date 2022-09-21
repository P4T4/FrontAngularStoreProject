import { NotiflixService, TypesOfReport } from './../services/notiflix.service';
import { ProductService } from './../services/product.service';
import { IProduct } from './../models/iproduct';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public products: IProduct[] = [];

  constructor(private productService: ProductService, private notiflixService: NotiflixService) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.products = [];
    this.productService.getProducts().subscribe({
      next: (result: IProduct[]) => {
        this.products = result;
      }, error: (err: any) => {
        console.log(err);
        this.notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }, complete: () => {
        console.log('complete productes list');
      }
    })
  }

  public saveContentModal(form: IProduct | null) {
    if (form == null) {
      return;
    }
    this.productService.saveClient(form).subscribe({
      next: (result: IProduct) => {
        console.log(result, 'saved');
      }, error: (err: any) => {
        console.log(err);
        this.notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }, complete: () => {
        this.notiflixService.closeLoader({ delay: 1000 });
        this.notiflixService.notify({ type: 'success', message: 'Producto ' + form.nombre + ' agregado exitosamente' })
        this.getData();
      }
    })
  }

  public updateContentModal(form: IProduct) {
    if (form?.id_producto == null) {
      return;
    }
    this.productService.updateClient(form).subscribe({
      next: () => {
        console.log('updated');
      }, error: (err: any) => {
        console.log(err);
        this.notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }, complete: () => {
        this.notiflixService.closeLoader({ delay: 1000 });
        this.notiflixService.notify({ type: 'success', message: 'Producto ' + form.nombre + ' actualizado exitosamente' })
        this.getData();
      }
    })
  }

  public remove(product: IProduct) {
    let confirmDelete = () => {
      this.productService.remove(product.id_producto).subscribe({
        next: () => {
          console.log('deleted');
        }, error: (err: any) => {
          console.log(err);
          this.notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
        }, complete: () => {
          this.notiflixService.closeLoader({ delay: 1000 });
          this.notiflixService.notify({ type: 'success', message: 'Producto ' + product.nombre + ' eliminado exitosamente' })
          this.getData();
        }
      });
    }
    this.notiflixService.confirm({
      title: 'Importante',
      message: 'Realmente desea realizar esta operación?',
      okButtonCallback: confirmDelete
    })
  }

}
