import { NotiflixService, TypesOfReport } from './../../../services/notiflix.service';
import { IProduct } from './../../../models/iproduct';
import { ProductService } from './../../../services/product.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPurchase } from 'src/app/models/ipurchase';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css']
})
export class CardFormComponent implements OnInit {
  @Output() savePurchase: EventEmitter<IPurchase> = new EventEmitter();

  public products: IProduct[] = []

  formPurchaseCard: FormGroup = new FormGroup({
    cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
    id_producto: new FormControl('', [Validators.required]),
  })

  public get cantidad() { return this.formPurchaseCard.get('cantidad') }
  public get id_producto() { return this.formPurchaseCard.get('id_producto') }

  constructor(
    private _productService: ProductService,
    private _notiflixService: NotiflixService
  ) { }

  ngOnInit(): void {
    this.getDataProducts();
  }

  private getDataProducts() {
    this.products = [];
    this._productService.getProducts().subscribe({
      next: (result: IProduct[]) => {
        this.products = result;
      },
      error: err => {
        this._notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }
    })
  }

  handlerSubmit(event: Event) {
    if (this.formPurchaseCard.valid) {
      this.savePurchase.emit(this.formPurchaseCard.value);
    }
  }

}
