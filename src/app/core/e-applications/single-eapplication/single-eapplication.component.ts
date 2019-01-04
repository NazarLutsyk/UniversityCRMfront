import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Eapplication} from '../../../models/eapplication';

@Component({
  selector: 'app-single-eapplication',
  templateUrl: './single-eapplication.component.html',
  styleUrls: ['./single-eapplication.component.css']
})
export class SingleEapplicationComponent implements OnInit {

  @Input() eapplication: Eapplication;

  @Output() onBuildEapp = new EventEmitter<Eapplication>();
  @Output() onDeleteEapp = new EventEmitter<number>();
  @Output() onBuildClient = new EventEmitter<Eapplication>();

  constructor() {
  }

  ngOnInit() {
  }

  buildEapp(eapplication: Eapplication) {
    this.onBuildEapp.emit(eapplication);
  }

  deleteEapp(eapplication: Eapplication) {
    this.onDeleteEapp.emit(eapplication.id);
  }

  buildClient(eapplication: Eapplication) {
    this.onBuildClient.emit(eapplication);
  }
}
