import {Component, OnInit} from '@angular/core';
import {Manager} from '../../../models/manager';
import {ActivatedRoute} from '@angular/router';
import {ManagerService} from '../../../services/manager.service';
import {CityService} from '../../../services/city.service';
import {City} from '../../../models/city';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';

@Component({
  selector: 'app-single-manager',
  templateUrl: './single-manager.component.html',
  styleUrls: ['./single-manager.component.css']
})
export class SingleManagerComponent implements OnInit {

  manager: Manager = new Manager();
  cities: City[] = [];
  managerCities = [];

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
    private managerService: ManagerService,
    private citiesService: CityService,
    private statisticService: StatisticService,
    public chartService: ChartService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.loadManager(id);
    });
  }

  loadManager(id) {
    this.citiesService.getCities({}).subscribe(response => this.cities = response.models);

    this.managerService.getManagerById(id, {attributes: ['id', 'name', 'surname', 'login', 'password', 'role'], include: ['cities']})
      .subscribe(manager => {
        this.loadStatistic();
        this.manager = manager;
        if (this.manager.cities && this.manager.cities.length > 0) {
          this.managerCities = [];
          this.managerCities = this.manager.cities.map(city => city.id);
        }
      });
  }

  updateManager() {
    const managerToUpdate = {
      name: this.manager.name,
      surname: this.manager.surname,
      login: this.manager.login,
      password: this.manager.password,
      role: this.manager.role,
      cities: this.managerCities ? this.managerCities : [],
    };
    this.managerService.update(this.manager.id, <Manager>managerToUpdate).subscribe(updated => {
      this.loadManager(updated.id);
    });
  }

  loadStatistic() {
    this.statisticService.getManagersStatisticByCity().subscribe((res) => {
      this.chartLabels = res.map(s => s.city);
      const data = res.map(s => s.count);
      this.chartDatasets = [
        {
          label: 'Cities',
          data,
        }
      ];
      this.chartColors = [{
        backgroundColor: this.chartService.getRandomColors(data.length)
      }];
    });
  }
}
