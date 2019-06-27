import {Component, OnInit} from '@angular/core';
import {City} from '../../../models/city';
import {ActivatedRoute} from '@angular/router';
import {CityService} from '../../../services/city.service';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';
import {NgForm} from '@angular/forms';
import {MatDatepicker} from '@angular/material';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-single-city',
  templateUrl: './single-city.component.html',
  styleUrls: ['./single-city.component.css']
})
export class SingleCityComponent implements OnInit {

  city: City = new City();

  canUpdateCity = false;

  chartLabels: String[] = [];
  chartDatasets: any[] = [];
  chartColors: any[] = [];
  chartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          min: 0
        }
      }],
      yAxes: [{
        ticks: {
          min: 0
        }
      }],
      responsive: true
    }
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private cityService: CityService,
    private statisticService: StatisticService,
    private chartService: ChartService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.loadStatistic();
    this.activatedRoute.params.subscribe(({id}) => {
      this.cityService.getCityById(id, {attributes: ['id', 'name']})
        .subscribe(city => {
          this.city = city;
        });
    });
    const p = this.authService.getLocalPrincipal();
    this.canUpdateCity = (p && [this.authService.roles.BOSS_ROLE].indexOf(p.role) > -1);
  }

  updateCity() {
    if (this.canUpdateCity) {
      this.cityService.update(this.city.id, this.city).subscribe(updated => this.city = updated);
    }
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
    this.statisticService.getApplicationsStatisticByCity({q: {startDate, endDate}}).subscribe((res) => {
      this.chartLabels = res.map(s => s.city);
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
