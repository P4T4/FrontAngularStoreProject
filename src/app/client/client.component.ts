import { NotiflixService, TypesOfReport } from './../services/notiflix.service';
import { ClientService } from './../services/client.service';
import { IClient } from './../models/iclient';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  public clients: IClient[] = [];

  constructor(private clientService: ClientService, private notiflixService: NotiflixService) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.notiflixService.openLoader({ messageOrOptions: 'Cargando listado de clientes' });
    this.clients = [];
    this.clientService.getClients().subscribe({
      next: (result: IClient[]) => {
        this.clients = result;
      }, error: (err: any) => {
        console.log(err);
        this.notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }, complete: () => {
        this.notiflixService.closeLoader({ delay: 1000 });
        console.log('complete clientes list');
      }
    })
  }

  public saveContentModal(form: IClient | null) {
    if (form == null) {
      return;
    }
    this.clientService.saveClient(form).subscribe({
      next: (result: IClient) => {
        console.log(result, 'saved');
      }, error: (err: any) => {
        console.log(err);
        this.notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }, complete: () => {
        this.notiflixService.closeLoader({ delay: 1000 });
        this.notiflixService.notify({ type: 'success', message: 'Cliente ' + form.nombre + ' agregado exitosamente' })
        this.getData();
      }
    })
  }

  public updateContentModal(form: IClient) {
    if (form?.id_cliente == null) {
      return;
    }
    this.clientService.updateClient(form).subscribe({
      next: () => {
        console.log('updated');
      }, error: (err: any) => {
        console.log(err);
        this.notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
      }, complete: () => {
        this.notiflixService.closeLoader({ delay: 1000 });
        this.notiflixService.notify({ type: 'success', message: 'Cliente ' + form.nombre + ' actualizado exitosamente' })
        this.getData();
      }
    })
  }

  public remove(client: IClient) {
    let confirmDelete = () => {
      this.clientService.remove(client.id_cliente).subscribe({
        next: () => {
          console.log('deleted');
        }, error: (err: any) => {
          console.log(err);
          this.notiflixService.report({ type: TypesOfReport.Failure, message: err.message })
        }, complete: () => {
          this.notiflixService.closeLoader({ delay: 1000 });
          this.notiflixService.notify({ type: 'success', message: 'Cliente ' + client.id_cliente + ' eliminado exitosamente' })
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
