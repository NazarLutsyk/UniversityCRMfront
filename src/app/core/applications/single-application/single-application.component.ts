import {Component, OnInit} from '@angular/core';
import {Application} from '../../../models/application';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../services/application.service';
import {SourceService} from '../../../services/source.service';
import {Source} from '../../../models/source';

@Component({
  selector: 'app-single-application',
  templateUrl: './single-application.component.html',
  styleUrls: ['./single-application.component.css']
})
export class SingleApplicationComponent implements OnInit {

  application: Application = new Application();

  sources: Source[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private applicationService: ApplicationService,
    private sourceService: SourceService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.sourceService.getSources({}).subscribe(response => this.sources = response.models);
      this.loadApplocation(id);
    });
  }

  loadApplocation(id) {
    this.applicationService.getApplicationById(id, {
      attributes: ['id', 'date', 'fullPrice', 'discount', 'resultPrice', 'leftToPay', 'sourceId'],
      include: ['client', 'source', 'course', 'group', 'contract', 'audio_calls', 'payments', 'lessons']
    })
      .subscribe(application => this.application = application);
  }

  updateApplication() {
    const applicationToUpdate = {
      sourceId: this.application.sourceId,
      date: this.application.date,
    };
    this.applicationService.update(this.application.id, applicationToUpdate).subscribe(updated => {
      this.loadApplocation(updated.id);
    });
  }

}
