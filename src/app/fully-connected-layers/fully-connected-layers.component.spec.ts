import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullyConnectedLayersComponent } from './fully-connected-layers.component';

describe('FullyConnectedLayersComponent', () => {
  let component: FullyConnectedLayersComponent;
  let fixture: ComponentFixture<FullyConnectedLayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullyConnectedLayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullyConnectedLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
