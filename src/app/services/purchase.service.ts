import { Observable } from 'rxjs';
import { IPurchase } from './../models/ipurchase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private uriClient: string = '';

  constructor(private http: HttpClient) {
    this.uriClient = environment.uri + '/ventas';
  }

  getPurchases(id_client: number): Observable<IPurchase[]> {
    return this.http.get<IPurchase[]>(this.uriClient, { params: { id_cliente: id_client } });
  }

  saveClient(client: IPurchase): Observable<IPurchase> {
    return this.http.post<IPurchase>(this.uriClient, client)
  }

  updateClient(client: IPurchase): Observable<void> {
    return this.http.put<void>(this.uriClient + '/' + client.id_venta, client)
  }

  remove(idClient: number): Observable<void> {
    return this.http.delete<void>(this.uriClient + '/' + idClient)
  }
}
