import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAndClientByEappComponent } from './app-and-client-by-eapp.component';

describe('AppAndClientByEappComponent', () => {
  let component: AppAndClientByEappComponent;
  let fixture: ComponentFixture<AppAndClientByEappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAndClientByEappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAndClientByEappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
