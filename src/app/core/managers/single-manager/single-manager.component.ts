import {Component, OnInit} from '@angular/core';
import {Manager} from '../../../models/manager';
import {ActivatedRoute} from '@angular/router';
import {ManagerService} from '../../../services/manager.service';
import {CityService} from '../../../services/city.service';
import {City} from '../../../models/city';

@Component({
  selector: 'app-single-manager',
  templateUrl: './single-manager.component.html',
  styleUrls: ['./single-manager.component.css']
})
export class SingleManagerComponent implements OnInit {

  manager: Manager = new Manager();

  cities: City[] = [];

  managerCities = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private managerService: ManagerService,
    private citiesService: CityService,
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
}
