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
import {City} from '../../../models/city';
import {CityService} from '../../../services/city.service';
import {AuthService} from '../../../services/auth.service';
import {NgForm} from '@angular/forms';
import {AudioCall} from '../../../models/audio-call';
import {AudioCallService} from '../../../services/audio-call.service';
import {UfileComponent} from '../../ufile/ufile.component';
import {UfileTypes} from '../../ufile/ufile-types';
import {MatDialog} from '@angular/material';
import {Social} from '../../../models/social';
import {SocialService} from '../../../services/social.service';
import {ClientStatusService} from '../../../services/client-status.service';
import {ClientStatus} from '../../../models/client-status';

@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.css']
})
export class SingleClientComponent implements OnInit {

  @ViewChild('form') updateClientForm: NgForm;
  @ViewChild('tasksTable') tasksTable;
  @ViewChild('commentTable') commentTable;
  @ViewChild('applicationTable') applicationTable;
  @ViewChild('audioCallsTable') audioCallsTable;
  @ViewChild('socialTable') socialTable;

  client: Client = new Client();
  clientStatuses: ClientStatus[] = [];
  sources: Source[] = [];
  courses: Course[] = [];
  cities: City[] = [];

  canUpdateClient = false;
  canSeeTasks = false;
  canSeeComments = false;
  canSeeApplications = false;
  canCreateApplication = false;
  canDeleteApplication = false;
  canSeeAudioCalls = false;
  canSeeSocials = false;

  audioCallFilesToUpload: File[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private taskService: TaskService,
    private commentService: CommentService,
    private sourceService: SourceService,
    private courseService: CourseService,
    private citiesService: CityService,
    private applicationService: ApplicationService,
    public authService: AuthService,
    private audioCallService: AudioCallService,
    private filesDialog: MatDialog,
    private socialService: SocialService,
    private clientStatusesService: ClientStatusService
    ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.loadClient(id);
    });

    const p = this.authService.getLocalPrincipal();
    const isBoss = p.role === this.authService.roles.BOSS_ROLE;
    const isTeacher = p.role === this.authService.roles.TEACHER_ROLE;
    const isManager = p.role === this.authService.roles.MANAGER_ROLE;

    this.canSeeTasks = isBoss || isManager;
    this.canSeeComments = isBoss || isManager || isTeacher;
    this.canSeeApplications = isBoss || isManager;
    this.canCreateApplication = isBoss || isManager;
    this.canDeleteApplication = isBoss || isManager;
    this.canSeeAudioCalls = isBoss || isManager;
    this.canSeeSocials = isBoss || isManager || isTeacher;

    if (isBoss || isManager || isTeacher) {
      this.sourceService.getSources({}).subscribe(response => this.sources = response.models);
      this.courseService.getCourses({}).subscribe(response => this.courses = response.models);
      this.citiesService.getCities({}).subscribe(response => this.cities = response.models);
    }

    this.clientStatusesService.getStatuses({}).subscribe(res => this.clientStatuses = res.models);
  }

  loadClient(id) {
    this.clientService.getClientById(id, {
      attributes: ['id', 'name', 'age', 'surname', 'phone', 'email', 'statusId', 'createdAt', 'updatedAt'], include: ['files', 'address']
    })
      .subscribe(client => {
        this.client = client;
        this.canUpdateClient = [
          this.authService.roles.BOSS_ROLE,
          this.authService.roles.MANAGER_ROLE
        ].indexOf(this.authService.getLocalPrincipal().role) > -1;

        if (!this.canUpdateClient) {
          this.updateClientForm.form.disable();
        }
      });
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
      date: commentForm.value.date
    };
    this.commentService.create(comment).subscribe(() => {
      commentForm.resetForm();
      this.commentTable.loadComments();
    });
  }

  createApplication(formApplication) {
    const applicationFormValue: Application = <Application>formApplication.form.value;
    const application: Application = <Application>{
      clientId: this.client.id,
      date: applicationFormValue.date,
      courseId: applicationFormValue.courseId,
      cityId: applicationFormValue.cityId,
      sources: applicationFormValue.sources ? applicationFormValue.sources : null,
      discount: applicationFormValue.discount,
      fullPrice: applicationFormValue.fullPrice,
      wantPractice: applicationFormValue.wantPractice ? 1 : 0,
      hasPractice: 0
    };
    this.applicationService.create(application).subscribe(() => {
      formApplication.resetForm();
      this.applicationTable.loadApplications();
    });
  }

  audioCallFileChange($event) {
    this.audioCallFilesToUpload = (<any>$event.target).files;
  }

  createAudioCall(audioCallForm: NgForm) {
    const audioCallValue: AudioCall = audioCallForm.value;
    audioCallValue.clientId = this.client.id;
    this.audioCallService.create(audioCallValue).subscribe((acr) => {
      this.audioCallService.uploadFiles(acr.id, this.audioCallFilesToUpload).subscribe(() => {
        this.audioCallsTable.loadAudioCalls();
      });
      audioCallForm.resetForm();
    });
  }

  editFiles(client: Client) {
    const filesDialogRef = this.filesDialog.open(UfileComponent, {
      disableClose: true,
      minWidth: '40%',
      data: {
        targetId: client.id,
        files: client.files,
        type: UfileTypes.PASSPORT
      }
    });
  }

  createSocial(socialForm: NgForm) {
    const social: Social = <Social>{
      clientId: this.client.id,
      url: socialForm.value.url
    };
    this.socialService.create(social).subscribe(() => {
      socialForm.resetForm();
      this.socialTable.loadSocials();
    });
  }

  setAddress(address: any) {
    this.client.address = address;
  }
}
