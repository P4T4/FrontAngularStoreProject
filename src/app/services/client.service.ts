import { IClient } from './../models/iclient';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private uriClient: string = '';

  constructor(private http: HttpClient) {
    this.uriClient = environment.uri + '/clientes';
  }

  getClients(): Observable<IClient[]> {
    return this.http.get<IClient[]>(this.uriClient);
  }

  getIndividualClient(id_client: number): Observable<IClient> {
    return this.http.get<IClient>(this.uriClient + '/' + id_client);
  }

  saveClient(client: IClient): Observable<IClient> {
    return this.http.post<IClient>(this.uriClient, client)
  }

  updateClient(client: IClient): Observable<void> {
    return this.http.put<void>(this.uriClient + '/' + client.id_cliente, client)
  }

  remove(idClient: number): Observable<void> {
    return this.http.delete<void>(this.uriClient + '/' + idClient)
  }
}
