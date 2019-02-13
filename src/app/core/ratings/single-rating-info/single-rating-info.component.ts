import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Client} from '../../../models/client';
import {ClientService} from '../../../services/client.service';

@Component({
  selector: 'app-single-rating-info',
  templateUrl: './single-rating-info.component.html',
  styleUrls: ['./single-rating-info.component.css']
})
export class SingleRatingInfoComponent implements OnInit {

  client: Client;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.clientService.getClientByIdWithLessons(id).subscribe((c) => {
          this.client = c;
      });
    });
  }

}
