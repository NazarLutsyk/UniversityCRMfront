import {Component, OnInit, ViewChild} from '@angular/core';
import {Course} from '../../../models/course';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../../services/course.service';
import {AuthService} from '../../../services/auth.service';
import {NgForm} from '@angular/forms';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';
import * as _ from 'lodash';

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

  appChartLabels: String[] = [];
  appChartDatasets: any[] = [];
  appChartColors: any[] = [];
  appChartOptions = {
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

  paymentChartLabels: String[] = [];
  paymentChartDatasets: any[] = [];
  paymentChartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
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
    this.loadApplicationStatistic();
    this.loadPaymentStatistic();

    this.activatedRoute.params.subscribe(({id}) => {

      this.sourceService.getCourseById(id, {attributes: ['id', 'name']})
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

  loadApplicationStatistic(datesForm: NgForm = null, reset: boolean = false) {
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
      this.appChartLabels = res.map(s => s.course);
      const data = res.map(s => s.count);
      this.appChartDatasets = [
        {
          label: 'Applications',
          data,
        }
      ];
      this.appChartColors = [{
        backgroundColor: this.chartService.getRandomColors(data.length)
      }];
    });
  }


  loadPaymentStatistic(datesForm: NgForm = null, reset: boolean = false) {
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

    this.statisticService.getPaymentsStatistic({q: {startDate, endDate}}).subscribe((res) => {
      this.paymentChartLabels = [];
      const filterPaid = [];
      const filterExpected = [];
      const groupedRes = _.groupBy(res, a => a.courseId);
      for (const key in groupedRes) {
        const course = groupedRes[key];
        if (course && course.length > 0) {
          this.paymentChartLabels.push(course[0].courseName);
          const paid = course.find(f => f.paid === 'paid');
          const expected = course.find(f => f.paid === 'expected');
          filterPaid.push(paid && +paid.sum ? +paid.sum : 0);
          filterExpected.push(expected && +expected.sum ? +expected.sum : 0);
        }
      }
      this.paymentChartDatasets = [
        {
          label: 'Paid',
          data: filterPaid,
          backgroundColor: this.chartService.getRandomColors(1)[0]
        },
        {
          label: 'Expected',
          data: filterExpected,
          backgroundColor: this.chartService.getRandomColors(1)[0]
        }
      ];
    });

  }
}
