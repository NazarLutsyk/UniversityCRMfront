import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';
import {Group} from '../../models/group';
import {Course} from '../../models/course';
import {CourseService} from '../../services/course.service';
import {GroupService} from '../../services/group.service';
import {City} from '../../models/city';
import {CityService} from '../../services/city.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  @ViewChild('groupsTable') groupsTable;

  courses: Course[] = [];
  cities: City[] = [];

  canCreateGroup = false;
  canDeleteGroup = false;

  constructor(
    private coursesService: CourseService,
    private citiesService: CityService,
    private groupsService: GroupService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    const p = this.authService.getLocalPrincipal();
    this.canCreateGroup = (p && [this.authService.roles.BOSS_ROLE, this.authService.roles.MANAGER_ROLE].indexOf(p.role) > -1);
    this.canDeleteGroup = this.canCreateGroup;

    this.coursesService.getCourses({}).subscribe(response => this.courses = response.models);
    this.citiesService.getCities({}).subscribe(response => this.cities = response.models);
  }


  createGroup(groupForm: NgForm) {
    const group: Group = <Group>groupForm.form.value;
    group.freePractice = group.freePractice ? group.freePractice : 0;
    group.usedPractice = 0;
    this.groupsService.create(group).subscribe((groupResponse) => {
      groupForm.resetForm();
      this.groupsTable.loadGroups();
    });
  }


  validatePractice(inputRef: NgModel) {
    if (+inputRef.value < 0) {
      inputRef.reset(0);
    }
  }
}
