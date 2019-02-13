import {Component, OnInit} from '@angular/core';
import {Course} from '../../models/course';
import {CourseService} from '../../services/course.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {

  colors: any[] = [
    {background: 'cadetblue', color: 'white'},
    {background: '#3a4660', color: 'white'},
    {background: '#5f719c', color: 'white'},
    {background: '#718fb7', color: 'white'},
    {background: '#a0483d', color: 'white'},
    {background: '#565d78', color: 'white'},
    {background: '#6e7881', color: 'white'},
  ];

  courses: Course[] = [];

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.courseService.getCourses().subscribe(c => this.courses = c.models);
  }

  getTileStyle() {
    const index = Math.floor(Math.random() * this.colors.length);
    return this.colors[index];
  }

  openRating(id: number) {
    this.router.navigate(['/ratings', id]);
  }
}
