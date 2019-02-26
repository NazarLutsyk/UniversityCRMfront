import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import * as MarkerClusterer from '@google/markerclusterer';

@Component({
  selector: 'app-clients-map',
  templateUrl: './clients-map.component.html',
  styleUrls: ['./clients-map.component.css']
})
export class ClientsMapComponent implements OnInit {

  @ViewChild('map') mapEl: ElementRef;
  map: google.maps.Map;
  locations = [];

  markers: google.maps.Marker[] = [];
  cluster;

  constructor(
    private clientsService: ClientService
  ) {
    this.loadAddresses();
  }

  ngOnInit() {
    window.navigator.geolocation.getCurrentPosition((coords) => {
      this.map = new google.maps.Map(this.mapEl.nativeElement, {
        center: new google.maps.LatLng(coords.coords.latitude, coords.coords.longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      this.setMarkers(this.locations);
    }, (err) => {
      this.map = new google.maps.Map(this.mapEl.nativeElement, {
        center: new google.maps.LatLng(49.85, 24.0166666667),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      this.setMarkers(this.locations);
    });
  }

  loadAddresses() {
    this.clientsService.getLocations().subscribe(l => {
      this.locations = l ? l.map((sl) => {
        return {lat: sl.ltg, lng: sl.lng};
      }) : [];
    });
  }

  clearMarkers() {
    if (this.markers && this.markers.length > 0) {
      this.markers.forEach(m => m.setMap(null));
    }
    this.markers = [];
  }

  setMarkers(locations) {
    this.clearMarkers();
    if (locations && locations.length > 0) {
      for (const l of locations) {
        this.markers.push(new google.maps.Marker({
            position: l
          })
        );
      }
    }
    this.setCluster(this.markers);
  }

  setCluster(markers = []) {
    if (this.cluster) {
      this.cluster.clearMarkers();
    }
    if (this.map && this.markers.length > 0) {
      this.cluster = new MarkerClusterer(this.map, markers, {
          imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        }
      );
    }
  }

}
