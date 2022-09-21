import { Observable } from 'rxjs';
import { IProduct } from './../models/iproduct';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private uriClient: string = '';

  constructor(private http: HttpClient) {
    this.uriClient = environment.uri + '/productoes';
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.uriClient);
  }

  saveClient(client: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.uriClient, client)
  }

  updateClient(client: IProduct): Observable<void> {
    return this.http.put<void>(this.uriClient + '/' + client.id_producto, client)
  }

  remove(idClient: number): Observable<void> {
    return this.http.delete<void>(this.uriClient + '/' + idClient)
  }
}
