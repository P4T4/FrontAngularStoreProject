import { NotiflixService, TypesOfReport } from './../../../services/notiflix.service';
import { ProductService } from './../../../services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPurchase } from 'src/app/models/ipurchase';
import { IProduct } from 'src/app/models/iproduct';

@Component({
  selector: 'app-modal-purchase',
  templateUrl: './modal-purchase.component.html',
  styleUrls: ['./modal-purchase.component.css']
})
export class ModalPurchaseComponent implements OnInit {
  @Output() close: EventEmitter<IPurchase> = new EventEmitter();
  @Input('purchase-edit') purchase?: IPurchase = new Input();

  public products: IProduct[] = []

  typeDataTransfer: string = 'Save';

  formPurchase: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cedula: new FormControl('', [Validators.required, Validators.minLength(8)]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  constructor(
    private modalService: NgbModal,
    private _productService: ProductService,
    private _notiflixService: NotiflixService
  ) { }

  ngOnInit(): void {
    if (this.purchase?.id_venta != null) {
      this.setFormData(this.purchase);
      this.typeDataTransfer = 'Update';
    }
  }

  public get cantidad() { return this.formPurchase.get('cantidad') }
  public get id_producto() { return this.formPurchase.get('id_producto') }

  public get isEdit() { return this.purchase?.id_venta != null }

  private setFormData(dataClient: IPurchase) {
    this.formPurchase = new FormGroup({
      cantidad: new FormControl(dataClient.cantidad, [Validators.required, Validators.min(1)]),
      id_producto: new FormControl(dataClient.id_producto, [Validators.required]),
    });
  }

  open(content: any) {
    this.getDataProducts()
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(result);
      let objectToReturn = this.formPurchase.value?.id_venta == null ? null : this.formPurchase.value;
      this.close.emit(objectToReturn);
    }, (reason) => {
      console.log(reason);
      let objectToReturn = this.formPurchase.value?.id_venta == null ? null : this.formPurchase.value;
      if (reason == 'Update') {
        objectToReturn = {
          ...this.formPurchase.value,
          id_venta: this.purchase?.id_venta
        }
      }
      this.close.emit(objectToReturn);
      if (reason == 'Save') {
        this.formPurchase.reset();
      }
    });
  }

  onModalClose(closeDispatcher: string) {
    if (this.formPurchase.invalid) {
      return;
    }
    this.modalService.dismissAll(closeDispatcher)
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
}
