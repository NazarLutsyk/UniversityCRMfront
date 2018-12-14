import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Group} from '../../models/group';
import {Course} from '../../models/course';
import {CourseService} from '../../services/course.service';
import {GroupService} from '../../services/group.service';
import {City} from '../../models/city';
import {CityService} from '../../services/city.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  @ViewChild('groupsTable') groupsTable;

  courses: Course[] = [];
  cities: City[] = [];

  constructor(
    private coursesService: CourseService,
    private citiesService: CityService,
    private groupsService: GroupService,
  ) {
  }

  ngOnInit() {
    this.coursesService.getCourses({}).subscribe(response => this.courses = response.models);
    this.citiesService.getCities({}).subscribe(response => this.cities = response.models);
  }


  createGroup(groupForm: NgForm) {
    const group: Group = <Group>groupForm.form.value;
    this.groupsService.create(group).subscribe((groupResponse) => {
      groupForm.resetForm();
      this.groupsTable.loadGroups();
    });
  }


}
