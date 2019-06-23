import {Component, OnInit} from '@angular/core';
import {ClientStatus} from '../../../models/client-status';
import {ActivatedRoute} from '@angular/router';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';
import {NgForm} from '@angular/forms';
import {MatDatepicker} from '@angular/material';
import {ClientStatusService} from '../../../services/client-status.service';

@Component({
  selector: 'app-single-client-status',
  templateUrl: './single-client-status.component.html',
  styleUrls: ['./single-client-status.component.css']
})
export class SingleClientStatusComponent implements OnInit {

  status: ClientStatus = new ClientStatus();

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
          stepSize: 1000
        }
      }],
      responsive: true
    }
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientStatusService: ClientStatusService,
    private statisticService: StatisticService,
    private chartService: ChartService
  ) {
  }

  ngOnInit() {

    this.loadStatistic();
    this.activatedRoute.params.subscribe(({id}) => {
      this.clientStatusService.getStatusById(id, {attributes: ['id', 'name', 'color', 'description']})
        .subscribe(status => {
          this.status = status;
        });
    });
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
    this.statisticService.getNumberOfClientByStatus({q: {startDate, endDate}}).subscribe((res) => {
      this.chartLabels = res.map(s => s.status);
      const data = res.map(s => s.count);
      this.chartDatasets = [
        {
          label: 'Clients',
          data,
        }
      ];
      const arr = res.map(s => s.color);
      this.chartColors = [{
        backgroundColor: arr
      }];
    });
  }

  updateStatus() {
    this.clientStatusService.update(this.status.id, this.status).subscribe(updated => this.status = updated);
  }

}
