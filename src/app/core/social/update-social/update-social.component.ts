import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UfileComponent} from '../../ufile/ufile.component';
import {Social} from '../../../models/social';
import {SocialService} from '../../../services/social.service';

@Component({
  selector: 'app-update-social',
  templateUrl: './update-social.component.html',
  styleUrls: ['./update-social.component.css']
})
export class UpdateSocialComponent implements OnInit {

  social: Social;

  constructor(
    private dialogRef: MatDialogRef<UfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socialService: SocialService
  ) {
  }

  ngOnInit() {
    this.social = {...this.data.social};
  }

  updateSocial() {
    this.socialService.update(this.social.id, <Social>{url: this.social.url}).subscribe((updated) => {
      this.dialogRef.close(updated);
    });
  }
}
