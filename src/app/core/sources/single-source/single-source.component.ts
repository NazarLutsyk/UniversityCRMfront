import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SourceService} from '../../../services/source.service';
import {Source} from '../../../models/source';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-single-source',
  templateUrl: './single-source.component.html',
  styleUrls: ['./single-source.component.css']
})
export class SingleSourceComponent implements OnInit {

  source: Source = new Source();

  chartLabels: String[] = [];
  chartDatasets: any[] = [];
  chartColors: any[] = [];
  chartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          stepSize: 1
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          stepSize: 1
        }
      }],
      responsive: true
    }
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private sourceService: SourceService,
    private statisticService: StatisticService,
    private chartService: ChartService
  ) {
  }

  ngOnInit() {
    this.loadStatistic();

    this.activatedRoute.params.subscribe(({id}) => {
      this.sourceService.getSourceById(id, {attributes: ['id', 'name']})
        .subscribe(source => this.source = source);
    });
  }

  updateSource() {
    this.sourceService.update(this.source.id, this.source).subscribe(updated => this.source = updated);
  }

  loadStatistic(datesForm: NgForm = null, reset: boolean = false) {
    let startDate = '';
    let endDate = '';
    if (datesForm) {
      if (reset) {
        startDate = '';
        endDate = '';
        datesForm.resetForm({startDate: '', endDate: ''});
      } else {
        startDate = datesForm.value.startDate;
        endDate = datesForm.value.endDate;
      }
    }

    this.statisticService.getApplicationsStatisticBySource({q: {startDate, endDate}}).subscribe((res) => {
      this.chartLabels = res.map(s => s.source);
      const data = res.map(s => s.count);
      this.chartDatasets = [
        {
          label: 'Applications',
          data,
        }
      ];
      this.chartColors = [{
        backgroundColor: this.chartService.getRandomColors(data.length)
      }];
    });
  }


}
