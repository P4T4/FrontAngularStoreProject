import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProduct } from 'src/app/models/iproduct';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.css']
})
export class ModalProductComponent implements OnInit {
  @Output() close: EventEmitter<IProduct> = new EventEmitter();
  @Input('product-edit') product?: IProduct = new Input();

  typeDataTransfer: string = 'Save';

  formProduct: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    valor: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    if (this.product?.nombre != null) {
      this.setFormData(this.product);
      this.typeDataTransfer = 'Update';
    }
  }

  public get nombre() { return this.formProduct.get('nombre') }
  public get valor() { return this.formProduct.get('valor') }

  public get isEdit() { return this.product?.nombre != null }

  private setFormData(dataProduct: IProduct) {
    this.formProduct = new FormGroup({
      nombre: new FormControl(dataProduct.nombre, [Validators.required, Validators.minLength(5)]),
      valor: new FormControl(dataProduct.valor, [Validators.required, Validators.minLength(3)])
    });
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(result);
      let objectToReturn = this.formProduct.value?.nombre == null ? null : this.formProduct.value;
      this.close.emit(objectToReturn);
    }, (reason) => {
      console.log(reason);
      let objectToReturn = this.formProduct.value?.nombre == null ? null : this.formProduct.value;
      if (reason == 'Update') {
        objectToReturn = {
          ...this.formProduct.value,
          id_producto: this.product?.id_producto
        }
      }
      this.close.emit(objectToReturn);
      if (reason == 'Save') {
        this.formProduct.reset();
      }
    });
  }

  onModalClose(closeDispatcher: string) {
    if (this.formProduct.invalid) {
      return;
    }
    this.modalService.dismissAll(closeDispatcher)
  }

}
