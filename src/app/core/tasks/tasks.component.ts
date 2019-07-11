import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Task} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {Client} from '../../models/client';
import {StorageService} from '../../services/storage.service';
import {MatExpansionPanel} from '@angular/material';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @ViewChild('formpanel') formPanel: MatExpansionPanel;
  @ViewChild('tasksTable') tasksTable;

  selectedClient: Client = new Client();

  taskForm = {
    date: null,
    message: ''
  };

  constructor(
    private tasksService: TaskService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((query) => {
      if (query.client) {
        this.selectedClient = JSON.parse(query.client);
        this.taskForm = this.storageService.taskLevel ? this.storageService.taskLevel : this.taskForm;
        this.formPanel.open();
      }
    });
  }

  selectClient($event) {
    $event.stopPropagation();
    this.storageService.taskLevel = this.taskForm;
    this.router.navigate(['clients'], {
      queryParams: {
        backURL: ['tasks'],
        selectEvent: true
      }
    });
  }

  createTask(form: NgForm) {
    const task: Task = <Task>{
      clientId: this.selectedClient.id,
      date: this.taskForm.date,
      message: this.taskForm.message
    };
    this.tasksService.create(task).subscribe((response) => {
      form.resetForm();
      this.selectedClient = new Client();
      this.tasksTable.loadTasks();
    });
  }

}
