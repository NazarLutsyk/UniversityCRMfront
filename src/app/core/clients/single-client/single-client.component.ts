import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Client} from '../../../models/client';
import {ClientService} from '../../../services/client.service';

@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.css']
})
export class SingleClientComponent implements OnInit {

  client: Client = new Client();

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.loadClient(id);
    });
  }

  loadClient(id) {
    this.clientService.getClientById(id, {
      attributes: ['id', 'name', 'surname', 'phone', 'email'], include: []
    })
      .subscribe(client => this.client = client);
  }

  updateClient() {
    this.clientService.update(this.client.id, this.client).subscribe(updated => {
      this.loadClient(updated.id);
    });
  }

}
