import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FittsTestComponent } from './fitts-test.component';

describe('FittsTestComponent', () => {
  let component: FittsTestComponent;
  let fixture: ComponentFixture<FittsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FittsTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FittsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
