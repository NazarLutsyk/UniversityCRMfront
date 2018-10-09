import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.css']
})
export class MaterialTableComponent implements OnInit {

  @Input() dataSource = [];
  @Input() headers: MaterialTableHeader[] = [];

  constructor() {
  }

  ngOnInit() {
  }

}

export interface MaterialTableHeader {
  header: string;
  key: string;
}
