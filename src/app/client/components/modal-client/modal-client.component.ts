import { IClient } from './../../../models/iclient';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal-client',
  templateUrl: './modal-client.component.html',
  styleUrls: ['./modal-client.component.css']
})
export class ModalClientComponent implements OnInit {
  @Output() close: EventEmitter<IClient> = new EventEmitter();
  @Input('client-edit') client?: IClient = new Input();

  typeDataTransfer: string = 'Save';

  formClient: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cedula: new FormControl('', [Validators.required, Validators.minLength(8)]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    if (this.client?.nombre != null) {
      this.setFormData(this.client);
      this.typeDataTransfer = 'Update';
    }
  }

  public get nombre() { return this.formClient.get('nombre') }
  public get apellido() { return this.formClient.get('apellido') }
  public get cedula() { return this.formClient.get('cedula') }
  public get telefono() { return this.formClient.get('telefono') }
  public get isEdit() { return this.client?.nombre != null }

  private setFormData(dataClient: IClient) {
    this.formClient = new FormGroup({
      nombre: new FormControl(dataClient.nombre, [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl(dataClient.apellido, [Validators.required, Validators.minLength(3)]),
      cedula: new FormControl(dataClient.cedula, [Validators.required, Validators.minLength(8)]),
      telefono: new FormControl(dataClient.telefono, [Validators.required, Validators.minLength(8)]),
    });
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(result);
      let objectToReturn = this.formClient.value?.nombre == null ? null : this.formClient.value;
      this.close.emit(objectToReturn);
    }, (reason) => {
      console.log(reason);
      let objectToReturn = this.formClient.value?.nombre == null ? null : this.formClient.value;
      if (reason == 'Update') {
        objectToReturn = {
          ...this.formClient.value,
          id_cliente: this.client?.id_cliente
        }
      }
      this.close.emit(objectToReturn);
      if (reason == 'Save') {
        this.formClient.reset();
      }
    });
  }

  onModalClose(closeDispatcher: string) {
    if (this.formClient.invalid) {
      return;
    }
    this.modalService.dismissAll(closeDispatcher)
  }

}
