import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UfileComponent} from '../../ufile/ufile.component';
import {AudioCall} from '../../../models/audio-call';
import {AudioCallService} from '../../../services/audio-call.service';

@Component({
  selector: 'app-update-audio-call',
  templateUrl: './update-audio-call.component.html',
  styleUrls: ['./update-audio-call.component.css']
})
export class UpdateAudioCallComponent implements OnInit {

  audioCall: AudioCall;

  constructor(
    private dialogRef: MatDialogRef<UfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private audioCallService: AudioCallService
  ) {
  }

  ngOnInit() {
    this.audioCall = {...this.data.audioCall};
  }

  updateAudioCall() {
    this.audioCallService.update(
      this.audioCall.id,
      <AudioCall>{comment: this.audioCall.comment, date: this.audioCall.date}
    ).subscribe((updated) => {
      this.dialogRef.close(updated);
    });
  }
}
