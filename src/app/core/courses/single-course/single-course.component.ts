import {Component, OnInit} from '@angular/core';
import {Course} from '../../../models/course';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../../services/course.service';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent implements OnInit {

  course: Course = new Course();

  constructor(
    private activatedRoute: ActivatedRoute,
    private sourceService: CourseService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.sourceService.getCourseById(id, {attributes: ['id', 'name', 'fullPrice', 'discount', 'resultPrice']})
        .subscribe(course => {
          this.course = course;
        });
    });
  }

  updateCourse() {
    this.sourceService.update(this.course.id, this.course).subscribe(updated => this.course = updated);
  }


  validateDiscount($event) {
    const value = $event.target.value;
    if (value < 0) {
      this.course.discount = 0;
    }
    if (value > 100) {
      this.course.discount = 100;
    }
  }

}
