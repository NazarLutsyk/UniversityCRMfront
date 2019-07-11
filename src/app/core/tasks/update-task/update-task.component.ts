import {Component, Inject, OnInit} from '@angular/core';
import {Task} from '../../../models/task';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UfileComponent} from '../../ufile/ufile.component';
import {TaskService} from '../../../services/task.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {

  task: Task;
  done: boolean;

  constructor(
    private dialogRef: MatDialogRef<UfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService
  ) {
  }

  ngOnInit() {
    this.task = {...this.data.task};
    this.done = this.task.done === 1;
  }

  updateTask() {
    this.taskService.update(this.task.id, {
      message: this.task.message,
      date: this.task.date,
      done: this.done ? 1 : 0
    }).subscribe((updated) => {
      this.dialogRef.close(updated);
      this.taskService.refreshTableSubject.next('refresh');
    });
  }

}
