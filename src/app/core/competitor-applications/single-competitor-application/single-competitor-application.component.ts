import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CompetitorApplication} from '../../../models/competitor-application';
import {CompetitorApplicationService} from '../../../services/competitor-application.service';

@Component({
  selector: 'app-single-competitor-application',
  templateUrl: './single-competitor-application.component.html',
  styleUrls: ['./single-competitor-application.component.css']
})
export class SingleCompetitorApplicationComponent implements OnInit {

  competitorApplication: CompetitorApplication = new CompetitorApplication();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private competitorApplicationService: CompetitorApplicationService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.loadCompetitorApplication(id);
    });
  }

  loadCompetitorApplication(id) {
    this.competitorApplicationService.getCompetitorApplicationById(id, {
      attributes: [
        'id',
        'date',
        'clientId',
        'competitorId',
        'courseId'
      ],
      include: ['client', 'course', 'competitor']
    })
      .subscribe(competitorApplication => {
        this.competitorApplication = competitorApplication;
      });
  }

  updateCompetitorApplication() {
    const competitorApplicationToUpdate = {
      date: this.competitorApplication.date,
    };
    this.competitorApplicationService
      .update(this.competitorApplication.id, <CompetitorApplication>competitorApplicationToUpdate).subscribe(updated => {
      this.loadCompetitorApplication(updated.id);
    });
  }

}
