import {Component, OnInit} from '@angular/core';
import {Manager} from '../../../models/manager';
import {ActivatedRoute} from '@angular/router';
import {ManagerService} from '../../../services/manager.service';

@Component({
  selector: 'app-single-manager',
  templateUrl: './single-manager.component.html',
  styleUrls: ['./single-manager.component.css']
})
export class SingleManagerComponent implements OnInit {

  manager: Manager = new Manager();

  constructor(
    private activatedRoute: ActivatedRoute,
    private managerService: ManagerService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.loadManager(id);
    });
  }

  loadManager(id) {
    this.managerService.getManagerById(id, {attributes: ['id', 'name', 'surname', 'login', 'password', 'role'], include: ['city']})
      .subscribe(manager => this.manager = manager);
  }

  updateManager() {
    const managerToUpdate = {
      name: this.manager.name,
      surname: this.manager.surname,
      login: this.manager.login,
      password: this.manager.password,
      role: this.manager.role,
      cityId: this.manager.cityId,
    };
    this.managerService.update(this.manager.id, <Manager>managerToUpdate).subscribe(updated => {
      this.loadManager(updated.id);
    });
  }
}
