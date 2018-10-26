import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Client} from '../../../models/client';
import {ClientService} from '../../../services/client.service';
import {TaskService} from '../../../services/task.service';
import {Task} from '../../../models/task';
import {CommentService} from '../../../services/comment.service';
import {Comment} from '../../../models/comment';
import {Source} from '../../../models/source';
import {Course} from '../../../models/course';
import {SourceService} from '../../../services/source.service';
import {CourseService} from '../../../services/course.service';
import {Application} from '../../../models/application';
import {ApplicationService} from '../../../services/application.service';

@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.css']
})
export class SingleClientComponent implements OnInit {

  @ViewChild('tasksTable') tasksTable;
  @ViewChild('commentTable') commentTable;
  @ViewChild('applicationTable') applicationTable;

  client: Client = new Client();
  sources: Source[] = [];
  courses: Course[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private taskService: TaskService,
    private commentService: CommentService,
    private sourceService: SourceService,
    private courseService: CourseService,
    private applicationService: ApplicationService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.loadClient(id);
    });
    this.sourceService.getSources({}).subscribe(response => this.sources = response.models);
    this.courseService.getCourses({}).subscribe(response => this.courses = response.models);
  }

  loadClient(id) {
    this.clientService.getClientById(id, {
      attributes: ['id', 'name', 'surname', 'phone', 'email'], include: []
    })
      .subscribe(client => this.client = client);
  }

  updateClient() {
    this.clientService.update(this.client.id, this.client).subscribe(updated => {
      this.loadClient(updated.id);
    });
  }

  createTask(taskForm) {
    const task: Task = <Task>{
      clientId: this.client.id,
      message: taskForm.value.message,
      date: taskForm.value.date,
    };
    this.taskService.create(task).subscribe(() => {
      taskForm.resetForm();
      this.tasksTable.loadTasks();
    });
  }

  createComment(commentForm) {
    const comment: Comment = <Comment>{
      clientId: this.client.id,
      text: commentForm.value.text,
      date: commentForm.value.date,
    };
    this.commentService.create(comment).subscribe(() => {
      commentForm.resetForm();
      this.commentTable.loadComments();
    });
  }

  validateDiscount($event) {
    const value = $event.target.value;
    if (value < 0) {
      $event.target.value = 0;
    }
    if (value > 100) {
      $event.target.value = 100;
    }
  }

  createApplication(formApplication) {
    const applicationFormValue: Application = <Application>formApplication.form.value;
    const application: Application = <Application>{
      clientId: this.client.id,
      date: applicationFormValue.date,
      courseId: applicationFormValue.courseId,
      sourceId: applicationFormValue.sourceId,
      discount: applicationFormValue.discount >= 0 ? applicationFormValue.discount : 0
    };
    this.applicationService.create(application).subscribe(() => {
      formApplication.resetForm();
      this.applicationTable.loadApplications();
    });

  }

}
