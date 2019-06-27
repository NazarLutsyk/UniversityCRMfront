import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Group} from '../../models/group';
import {StatisticService} from '../../services/statistic.service';
import {NgForm} from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @ViewChild('groupsTable') groupsTable;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  groups: Group[] = [];
  query: any = {};

  chartLabels: String[] = [];
  chartDatasets: any[] = [];
  chartColors: any[] = [];
  chartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          min: 0
        }
      }],
      yAxes: [{
        ticks: {
          min: 0
        }
      }],
      responsive: true
    }
  };

  constructor(
    private rend: Renderer2,
    private statisticService: StatisticService
  ) { }

  ngOnInit() {

    this.groupsTable.sendGroups.subscribe(res => {
        this.groups = res;
        setTimeout(() => {
          this.loadStatistic();
          }, 5
        );
      });
      this.rend.listen(document, 'click', (event) => {
        if (event.target === document.getElementById('all-groups-checkbox')) {
          const groupsIdInputs = document.getElementsByClassName('group-id-input') as any;
          if (event.target.checked === true) {
            for (let i = 0; i < groupsIdInputs.length; i++) {
              if (groupsIdInputs[i].checked === false) {
                groupsIdInputs[i].click();
              }
            }
          } else {
            for (let i = 0; i < groupsIdInputs.length; i++) {
              if (groupsIdInputs[i].checked === true) {
                groupsIdInputs[i].click();
              }
            }
          }
        }
        if (event.target.classList.contains('group-id-input')) {
          this.loadStatistic();
        }
      });
  }

  createQuery() {
    this.query.q = {};
    const arr = [];
    const groupsIdInputs = document.getElementsByClassName('group-id-input') as any;
    for (let i = 0; i < groupsIdInputs.length; i++) {
      if (groupsIdInputs[i].checked == true) {
        arr.push(groupsIdInputs[i].value);
      }
    }
    this.query.q.groupsIds = arr;
    const fromDate = document.getElementById('fromDate') as any;
    const fromDateArr = fromDate.value.split('.');
    if (fromDate.value) {
      this.query.q.fromDate = `${fromDateArr[2]}-${fromDateArr[1]}-${fromDateArr[0]}`;
    }
    const toDate = document.getElementById('toDate') as any;
    const toDateArr = toDate.value.split('.');
    if (toDate.value) {
      this.query.q.toDate = `${toDateArr[2]}-${toDateArr[1]}-${toDateArr[0]}`;
    }
      return this.query;
  }

  refreshChart() {
        if (this.chart && this.chart.chart && this.chart.chart.config) {
          this.chart.chart.config.data.labels = this.chartLabels;
          this.chart.chart.config.data.datasets = this.chartDatasets;
          this.chart.chart.update();
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
    this.statisticService.getPaymentsForReport(this.createQuery()).subscribe((res) => {
      this.chartLabels = res[0].map(s => s.status);
      const data = res[0].map(s => s.amount);
      const dataExpected = res[1].map(s => s.expectedAmount);
      this.chartDatasets = [
          {
            label: 'Оплачено',
            data,
          },
          {
            label: 'Очікувана сума',
            data: dataExpected
          }
        ];
      setTimeout(() => {
        this.refreshChart();
          const colors = res[0].map(s => s.color);
          this.chartColors = [{
            backgroundColor: colors
          }];
      }, 10);
    });
  }
}
