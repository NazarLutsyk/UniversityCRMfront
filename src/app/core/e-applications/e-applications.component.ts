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
    const eappToUpdate = new Eapplication(
      eapplication.id,
      eapplication.name,
      eapplication.surname,
      eapplication.age,
      eapplication.city,
      eapplication.phone,
      eapplication.email,
      eapplication.course,
      eapplication.type,
      eapplication.social,
      eapplication.source,
      eapplication.wantTime,
      eapplication.comment,
      eapplication.date,
      eapplication.updateAt,
      eapplication.createdAt,
      eapplication.wantPractice,
      0
    );
    // this.eaplicationService.update(eapplication.id, eappToUpdate).subscribe(res => {
    //   console.log(res);
    // });
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
      for (let i = 0; i < this.eapplications.length; i++) {
        this.eapplications[i].date = this.eapplications[i].createdAt;
      }
    });
  }

  buildClient(eapplication: Eapplication) {
    const client = {
      id: eapplication.id,
      name: eapplication.name,
      surname: eapplication.surname,
      email: eapplication.email,
      phone: eapplication.phone,
      comment: eapplication.comment,
      age: eapplication.age,
      address: eapplication.city,
      statusId: 1,
      city: eapplication.city,
      course: eapplication.course,
      type: eapplication.type,
      social: eapplication.social,
      source: eapplication.source,
      wantTime: eapplication.wantTime,
      date: eapplication.date,
      updateAt: eapplication.updateAt,
      createdAt: eapplication.createdAt,
      wantPractice: eapplication.wantPractice,
    };
    this.router.navigate(['/clients-and-applications'], {
      queryParams: {
        client: JSON.stringify(client)
      }
    });
  }
}
