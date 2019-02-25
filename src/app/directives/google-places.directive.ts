import {Directive, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {} from '@types/googlemaps';


@Directive({
  selector: '[appGooglePlaces]'
})
export class GooglePlacesDirective implements OnInit {

  private element: HTMLInputElement;

  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  constructor(private elRef: ElementRef) {
    this.element = elRef.nativeElement;
  }

  ngOnInit() {
    try {
      const autocomplete = new google.maps.places.Autocomplete(this.element);
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        try {
          const place = autocomplete.getPlace();
          console.log(place);
          const placeRes = {
            address: place && place.formatted_address ? place.formatted_address : '',
            ltg: place && place.geometry ? place.geometry.location.lat() : 0,
            lng: place && place.geometry ? place.geometry.location.lng() : 0
          };
          this.onSelect.emit(placeRes);
        } catch (e) {
          console.log(e);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}
