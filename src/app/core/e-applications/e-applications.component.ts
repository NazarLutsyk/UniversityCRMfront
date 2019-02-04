import {Component, OnInit} from '@angular/core';
import {Eapplication} from '../../models/eapplication';
import {EapplicationService} from '../../services/eapplication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-e-applications',
  templateUrl: './e-applications.component.html',
  styleUrls: ['./e-applications.component.css']
})
export class EApplicationsComponent implements OnInit {

  eapplications: Eapplication[] = [];

  constructor(
    private eaplicationService: EapplicationService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.eaplicationService.$neweapp.subscribe((eapp: any) => {
      this.eapplications.push(eapp.json);
    });
    this.loadEapplications();
  }

  buildEapp(eapplication: Eapplication) {
    this.router.navigate(['/applications'], {
      queryParams: {
        eapplication: JSON.stringify(eapplication)
      }
    });
  }

  deleteEapp(id: number) {
    this.eaplicationService.remove(id).subscribe(_ => this.loadEapplications());
  }

  loadEapplications() {
    this.eaplicationService.getEapplications({}).subscribe(eas => {
      this.eapplications = eas.models;
    });
  }

  buildClient(eapplication: Eapplication) {
    const client = {
      name: eapplication.name,
      surname: eapplication.surname,
      email: eapplication.email,
      phone: eapplication.phone,
    };
    this.router.navigate(['/clients'], {
      queryParams: {
        client: JSON.stringify(client)
      }
    });
  }
}
