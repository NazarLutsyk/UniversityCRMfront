import {Component, OnInit, ViewChild} from '@angular/core';
import {City} from '../../models/city';
import {CityService} from '../../services/city.service';
import {NgForm} from '@angular/forms';
import {Manager} from '../../models/manager';
import {ManagerService} from '../../services/manager.service';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css']
})
export class ManagersComponent implements OnInit {

  @ViewChild('managersTable') managersTable;

  cities: City[] = [];

  constructor(
    private citiesService: CityService,
    private managersService: ManagerService,
  ) {
  }

  ngOnInit() {
    this.citiesService.getCities({}).subscribe(response => this.cities = response.models);
  }


  createManager(managerForm: NgForm) {
    const manager: Manager = <Manager>managerForm.form.value;
    this.managersService.create(manager).subscribe((managerResponse) => {
      managerForm.resetForm();
      this.managersTable.loadManagers();
    });
  }

}
