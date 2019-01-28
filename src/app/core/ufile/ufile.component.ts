import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UfileData} from './ufile-data';
import {Ufile} from '../../models/ufile';
import {UfileTypes} from './ufile-types';
import {PaymentService} from '../../services/payment.service';
import {ContractService} from '../../services/contract.service';
import {ClientService} from '../../services/client.service';
import {AudioCallService} from '../../services/audio-call.service';
import {UfileService} from '../../services/ufile.service';
import {ConfigService} from '../../services/config.service';
import {MaterialTableService} from '../../services/material-table.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-ufile',
  templateUrl: './ufile.component.html',
  styleUrls: ['./ufile.component.css']
})
export class UfileComponent implements OnInit {

  filesToUpload: File[] = [];

  targetId: string | number = null;
  targetType: UfileTypes = null;
  currentFiles: Ufile[] = [];

  constructor(
    private dialogRef: MatDialogRef<UfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UfileData,
    private paymentService: PaymentService,
    private contractService: ContractService,
    private passportService: ClientService,
    private audioCallService: AudioCallService,
    private ufileService: UfileService,
    private configService: ConfigService,
    private materialTableService: MaterialTableService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.targetId = this.data.targetId;
    this.targetType = this.data.type;
    this.currentFiles = this.data.files;
  }

  newFilesChange($event) {
    this.filesToUpload = (<any>event.target).files;
  }

  downloadFile(file: Ufile) {
    window.open(`${this.configService.public}/${file.path}`);
  }

  deleteFile(file: Ufile) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.ufileService.remove(file.id).subscribe(() => {
        const fileIndexToPop = this.currentFiles.findIndex(f => f.id === file.id);
        this.currentFiles.splice(fileIndexToPop, 1);
      });
    });
  }

  addFiles() {
    switch (this.targetType) {
      case UfileTypes.PAYMENT : {
        this.paymentService
          .uploadFiles(<number>this.targetId, this.filesToUpload)
          .subscribe(files => this.addCurrentFiles(files));
        break;
      }
      case UfileTypes.CONTRACT : {
        this.contractService
          .uploadContractFiles(<number>this.targetId, this.filesToUpload)
          .subscribe(files => this.addCurrentFiles(files));
        break;
      }
      case UfileTypes.PASSPORT : {
        this.passportService
          .uploadPassportFiles(<number>this.targetId, this.filesToUpload)
          .subscribe(files => this.addCurrentFiles(files));
        break;
      }
      case UfileTypes.AUDIO_CALL : {
        this.audioCallService
          .uploadFiles(<number>this.targetId, this.filesToUpload)
          .subscribe(files => this.addCurrentFiles(files));
        break;
      }
    }
  }

  addCurrentFiles(newFiles: Ufile[]) {
    if (newFiles && newFiles.length > 0) {
      if (!this.currentFiles || this.currentFiles.length <= 0) {
        this.currentFiles = [...newFiles];
      } else {
        const toAdd = newFiles
          .filter((newFile) => {
            return !this.currentFiles.some(oldFile => oldFile.id == newFile.id);
          });
        this.currentFiles.push(...toAdd);
      }
    }
  }
}
