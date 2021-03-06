import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {Observable} from 'rxjs';
import {AudioCall} from '../../../models/audio-call';
import {AudioCallService} from '../../../services/audio-call.service';
import {UfileComponent} from '../../ufile/ufile.component';
import {UfileTypes} from '../../ufile/ufile-types';
import {MatDialog} from '@angular/material';
import {UpdateAudioCallComponent} from '../update-audio-call/update-audio-call.component';
import {isNumber} from 'util';

@Component({
  selector: 'app-audio-calls-table',
  templateUrl: './audio-calls-table.component.html',
  styleUrls: ['./audio-calls-table.component.css']
})
export class AudioCallsTableComponent implements OnInit {

  @Input() byClientId;

  audioCalls: AudioCall[] = [];

  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public materialTableService: MaterialTableService,
    public audioCallService: AudioCallService,
    private filesDialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.loadAudioCalls();
  }

  loadAudioCalls() {
    this.sendLoadAudioCalls().subscribe(response => {
      this.count = response.count;
      this.audioCalls = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadAudioCalls();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadAudioCalls();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadAudioCalls();
  }

  private sendLoadAudioCalls(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.audioCallService.getAudioCalls({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      attributes: ['id', 'comment', 'date', 'clientId', 'createdAt'],
      include: ['client', 'file']
    });
  }

  private getFilterToSend() {
    const res: any = {};
    if (this.filter.comment) {
      res.comment = {$like: `${this.filter.comment}`};
    }
    if (this.byClientId) {
      res.clientId = this.byClientId;
    }
    if (this.filter.clientFullname) {
      res.clientFullname = this.filter.clientFullname;
    }
    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.audioCallService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadAudioCalls();
      });
    });
  }

  editFiles(audioCall: AudioCall, event) {
    event.stopPropagation();
    const filesDialogRef = this.filesDialog.open(UfileComponent, {
      disableClose: true,
      minWidth: '40%',
      data: {
        targetId: audioCall.id,
        files: audioCall.files,
        type: UfileTypes.AUDIO_CALL
      }
    });
    filesDialogRef.afterClosed().subscribe((result) => {
      this.loadAudioCalls();
    });
  }

  update(audioCall: AudioCall, $event) {
    $event.stopPropagation();
    const isControl = $event.target.dataset.controls;
    if (isControl) {
      return false;
    }
    const matDialogRef = this.filesDialog.open(UpdateAudioCallComponent, {
      disableClose: true,
      minWidth: '40%',
      data: {
        audioCall
      }
    });
    matDialogRef.afterClosed().subscribe((updated) => {
      if (updated && updated.comment && updated.date) {
        audioCall.comment = updated.comment;
        audioCall.date = updated.date;
      }
    });


  }
}
