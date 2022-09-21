import { ClientService } from './../services/client.service';
import { IClient } from './../models/iclient';
import { TypesOfReport, NotiflixService } from './../services/notiflix.service';
import { PurchaseService } from './../services/purchase.service';
import { IPurchase } from './../models/ipurchase';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  public client: IClient | null = null;
  public purchases: IPurchase[] = [];

  constructor(
    private _purchaseService: PurchaseService,
    private _clientService: ClientService,
    private _notiflixService: NotiflixService,
    private _route: ActivatedRoute
  ) { }

  public get sumatoria() {
    return this.purchases.reduce((previosValue: number, currentValue: IPurchase) =>
      previosValue += ((currentValue?.producto?.valor ?? 0) * currentValue.cantidad),
      0
    );
  }

  ngOnInit(): void {
    this.getClientData(this._route.snapshot.paramMap.get('id_client'));
  }

  private getClientData(id_client: string | null) {
    if (id_client == null) {
      return;
    }
    this._clientService.getIndividualClient(Number(id_client)).subscribe({
      next: (result: IClient) => {
        this.client = result;
        this.getData(this.client.id_cliente);
      },
      error: (err) => {
        this._notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }
    })
  }

  private getData(id_client: number) {
    this.purchases = [];
    this._purchaseService.getPurchases(id_client).subscribe({
      next: (result: IPurchase[]) => {
        this.purchases = result;
      }, error: (err: any) => {
        console.log(err);
        this._notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }, complete: () => {
        console.log('complete clientes list');
      }
    })
  }

  public saveContentModal(form: IPurchase | null) {
    if (form == null) {
      return;
    }
    let formToUpdate: IPurchase = { ...form, id_cliente: this.client?.id_cliente ?? 0, valor_total: form.cantidad * (form.producto?.valor ?? 0) }
    this._purchaseService.saveClient(formToUpdate).subscribe({
      next: (result: IPurchase) => {
        console.log(result, 'saved');
      }, error: (err: any) => {
        console.log(err);
        this._notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }, complete: () => {
        this._notiflixService.closeLoader({ delay: 1000 });
        this._notiflixService.notify({ type: 'success', message: 'Producto agregado en el carrito exitosamente' })
        this.getData(this.client?.id_cliente ?? 0);
      }
    })
  }

  public updateContentModal(form: IPurchase) {
    if (form?.id_venta == null) {
      return;
    }
    let formToUpdate: IPurchase = { ...form, id_cliente: this.client?.id_cliente ?? 0, valor_total: form.cantidad * (form.producto?.valor ?? 0) }
    this._purchaseService.updateClient(formToUpdate).subscribe({
      next: () => {
        console.log('updated');
      }, error: (err: any) => {
        console.log(err);
        this._notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }, complete: () => {
        this._notiflixService.closeLoader({ delay: 1000 });
        this._notiflixService.notify({ type: 'success', message: 'Producto actualizado en el carrito exitosamente' })
        this.getData(this.client?.id_cliente ?? 0);
      }
    })
  }

  public remove(purchase: IPurchase) {
    let confirmDelete = () => {
      this._purchaseService.remove(purchase?.id_venta ?? 0).subscribe({
        next: () => {
          console.log('deleted');
        }, error: (err: any) => {
          console.log(err);
          this._notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
        }, complete: () => {
          this._notiflixService.closeLoader({ delay: 1000 });
          this._notiflixService.notify({ type: 'success', message: 'Producto eliminado del carrito' })
          this.getData(this.client?.id_cliente ?? 0);
        }
      });
    }
    this._notiflixService.confirm({
      title: 'Importante',
      message: 'Realmente desea realizar esta operación?',
      okButtonCallback: confirmDelete
    })
  }

  getSumaFromQuantityAndValue(cantidad: number, valor: number) {
    return cantidad * valor;
  }
}
