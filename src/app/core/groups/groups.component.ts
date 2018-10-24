import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Group} from '../../models/group';
import {Course} from '../../models/course';
import {CourseService} from '../../services/course.service';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  @ViewChild('groupsTable') groupsTable;

  courses: Course[] = [];

  constructor(
    private coursesService: CourseService,
    private groupsService: GroupService,
  ) {
  }

  ngOnInit() {
    this.coursesService.getCourses({}).subscribe(response => this.courses = response.models);
  }


  createGroup(groupForm: NgForm) {
    const group: Group = <Group>groupForm.form.value;
    this.groupsService.create(group).subscribe((groupResponse) => {
      groupForm.resetForm();
      this.groupsTable.loadGroups();
    });
  }


}
