import {Component, OnInit, ViewChild} from '@angular/core';
import {Course} from '../../../models/course';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../../services/course.service';
import {AuthService} from '../../../services/auth.service';
import {NgForm} from '@angular/forms';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent implements OnInit {

  @ViewChild('form') updateCourseForm: NgForm;

  course: Course = new Course();

  canUpdateCourse = false;
  canDeleteGroup = false;

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
    private sourceService: CourseService,
    public authService: AuthService,
    private statisticService: StatisticService,
    private chartService: ChartService
  ) {
  }

  ngOnInit() {
    this.loadStatistic();

    this.activatedRoute.params.subscribe(({id}) => {

      this.sourceService.getCourseById(id, {attributes: ['id', 'name', 'fullPrice', 'discount', 'resultPrice']})
        .subscribe(course => {
          this.course = course;

          const p = this.authService.getLocalPrincipal();
          this.canUpdateCourse = (p && [this.authService.roles.BOSS_ROLE, this.authService.roles.MANAGER_ROLE].indexOf(p.role) > -1);
          this.canDeleteGroup = this.canUpdateCourse;
          if (!this.canUpdateCourse) {
            this.updateCourseForm.form.disable();
          }
        });
    });
  }

  updateCourse() {
    if (this.canUpdateCourse) {
      this.sourceService.update(this.course.id, this.course).subscribe(updated => this.course = updated);
    }
  }


  validateDiscount($event) {
    const value = +$event.target.value;
    if (value < 0) {
      this.course.discount = 0;
      $event.target.value = this.course.discount;
    }
    if (value > 100) {
      this.course.discount = 100;
      $event.target.value = this.course.discount;
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

    this.statisticService.getApplicationsStatisticByCourse({q: {startDate, endDate}}).subscribe((res) => {
      this.chartLabels = res.map(s => s.course);
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
