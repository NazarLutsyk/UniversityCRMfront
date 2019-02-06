import {Component, OnInit, ViewChild} from '@angular/core';
import {MatExpansionPanel} from '@angular/material';
import {Client} from '../../models/client';
import {CourseService} from '../../services/course.service';
import {StorageService} from '../../services/storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {CompetitorApplicationService} from '../../services/competitor-application.service';
import {CompetitorService} from '../../services/competitor.service';
import {Course} from '../../models/course';
import {CompetitorApplication} from '../../models/competitor-application';
import {Competitor} from '../../models/competitor';

@Component({
  selector: 'app-competitor-applications',
  templateUrl: './competitor-applications.component.html',
  styleUrls: ['./competitor-applications.component.css']
})
export class CompetitorApplicationsComponent implements OnInit {

  @ViewChild('formpanel') formPanel: MatExpansionPanel;
  @ViewChild('competitorApplicationsTable') competitorApplicationsTable;

  selectedClient: Client = new Client();

  competitors: Competitor[] = [];
  courses: Course[] = [];

  competitorApplicationForm = {
    competitorId: null,
    courseId: null,
    clientId: null,
    date: null
  };

  constructor(
    public courseService: CourseService,
    public competitorApplicationService: CompetitorApplicationService,
    public competitorService: CompetitorService,
    public storageService: StorageService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((query) => {
      if (query.client) {
        this.selectedClient = JSON.parse(query.client);
        this.competitorApplicationForm = this.storageService.competitorApplicationsLevel
          ? this.storageService.competitorApplicationsLevel
          : this.competitorApplicationForm;
        this.formPanel.open();
      }
    });
    this.courseService.getCourses({}).subscribe(response => this.courses = response.models);
    this.competitorService.getCompetitors({}).subscribe(response => this.competitors = response.models);
  }

  selectClient($event) {
    $event.stopPropagation();
    this.storageService.competitorApplicationsLevel = this.competitorApplicationForm;
    this.router.navigate(['clients'], {
      queryParams: {
        backURL: ['competitor-applications'],
        selectEvent: true
      }
    });
  }

  createCompetitorApplication(competitorApplicationForm: NgForm) {
    const competitorApplication: CompetitorApplication = <CompetitorApplication>{
      clientId: this.selectedClient.id,
      courseId: this.competitorApplicationForm.courseId,
      competitorId: this.competitorApplicationForm.competitorId,
      date: this.competitorApplicationForm.date
    };
    this.competitorApplicationService.create(competitorApplication).subscribe((competitorApplicationResponse) => {
      competitorApplicationForm.resetForm();
      this.selectedClient = new Client();
      this.competitorApplicationsTable.loadCompetitorApplications();
    });
  }

}
