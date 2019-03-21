import {Component, OnInit, Renderer2} from '@angular/core';
import {DbLoadStatusService} from '../../services/db-load-status.service';
@Component({
  selector: 'app-preload',
  templateUrl: './preload.component.html',
  styleUrls: ['./preload.component.css']
})
export class PreloadComponent implements OnInit {

  constructor(
    private preloadService: DbLoadStatusService,
    private rendered: Renderer2,
  ) { }

  ngOnInit() {
    this.preloadService.$statusPreloadingData.subscribe( (status) => {
      if (status === 'true') {
        this.showPreloading();
      } else {
        this.hidePreloading();
      }
    });
  }
private showPreloading() {
    const logo = document.getElementsByClassName('logo-wrapped')[0];
    this.rendered.addClass(logo, 'show-logo');
}

private hidePreloading() {
  const logo = document.getElementsByClassName('logo-wrapped')[0];
  this.rendered.removeClass(logo, 'show-logo');
}

}
