import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Conv2DComponent } from './conv2-d.component';

describe('Conv2DComponent', () => {
  let component: Conv2DComponent;
  let fixture: ComponentFixture<Conv2DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Conv2DComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Conv2DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
