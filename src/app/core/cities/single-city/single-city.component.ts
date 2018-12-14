import {Component, OnInit} from '@angular/core';
import {City} from '../../../models/city';
import {ActivatedRoute} from '@angular/router';
import {CityService} from '../../../services/city.service';

@Component({
  selector: 'app-single-city',
  templateUrl: './single-city.component.html',
  styleUrls: ['./single-city.component.css']
})
export class SingleCityComponent implements OnInit {

  city: City = new City();

  constructor(
    private activatedRoute: ActivatedRoute,
    private cityService: CityService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.cityService.getCityById(id, {attributes: ['id', 'name']})
        .subscribe(city => {
          this.city = city;
        });
    });
  }

  updateCity() {
    this.cityService.update(this.city.id, this.city).subscribe(updated => this.city = updated);
  }


}
