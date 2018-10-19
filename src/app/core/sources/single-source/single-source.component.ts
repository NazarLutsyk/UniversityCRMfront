import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SourceService} from '../../../services/source.service';
import {Source} from '../../../models/source';

@Component({
  selector: 'app-single-source',
  templateUrl: './single-source.component.html',
  styleUrls: ['./single-source.component.css']
})
export class SingleSourceComponent implements OnInit {

  source: Source = new Source();

  constructor(
    private activatedRoute: ActivatedRoute,
    private sourceService: SourceService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.sourceService.getSourceById(id, {attributes: ['id', 'name']})
        .subscribe(source => this.source = source);
    });
  }

  updateSource() {
    this.sourceService.update(this.source.id, this.source).subscribe(updated => this.source = updated);
  }
}
