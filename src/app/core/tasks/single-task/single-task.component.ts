import {Component, OnInit} from '@angular/core';
import {Task} from '../../../models/task';
import {ActivatedRoute} from '@angular/router';
import {TaskService} from '../../../services/task.service';

@Component({
  selector: 'app-single-task',
  templateUrl: './single-task.component.html',
  styleUrls: ['./single-task.component.css']
})
export class SingleTaskComponent implements OnInit {

  task: Task = new Task();

  constructor(
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.loadTask(id);
    });
  }

  loadTask(id) {
    this.taskService.getTaskById(id, {attributes: ['id', 'message', 'date'], include: ['client']})
      .subscribe(task => {
        this.task = task;
        this.task.date = new Date(this.task.date).toISOString().split('T')[0];
      });
  }

  updateTask() {
    this.taskService.update(this.task.id, this.task).subscribe(updated => {
      this.loadTask(updated.id);
    });
  }

}
