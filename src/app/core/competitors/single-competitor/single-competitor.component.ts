import { Component, OnInit } from '@angular/core';
import {Competitor} from '../../../models/competitor';
import {ActivatedRoute} from '@angular/router';
import {CompetitorService} from '../../../services/competitor.service';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-single-competitor',
  templateUrl: './single-competitor.component.html',
  styleUrls: ['./single-competitor.component.css']
})
export class SingleCompetitorComponent implements OnInit {

  competitor: Competitor = new Competitor();

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
    private competitorService: CompetitorService,
    private statisticService: StatisticService,
    private chartService: ChartService
  ) {
  }

  ngOnInit() {
    this.loadStatistic();
    this.activatedRoute.params.subscribe(({id}) => {
      this.competitorService.getCompetitorById(id, {attributes: ['id', 'name']})
        .subscribe(competitor => {
          this.competitor = competitor;
        });
    });
  }

  updateCompetitor() {
    this.competitorService.update(this.competitor.id, this.competitor).subscribe(updated => this.competitor = updated);
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
    this.statisticService.getApplicationsStatisticByCompetitor({q: {startDate, endDate}}).subscribe((res) => {
      this.chartLabels = res.map(s => s.competitor);
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
