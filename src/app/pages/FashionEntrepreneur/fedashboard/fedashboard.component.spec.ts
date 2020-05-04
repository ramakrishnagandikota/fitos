import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FEdashboardComponent } from './fedashboard.component';

describe('FEdashboardComponent', () => {
  let component: FEdashboardComponent;
  let fixture: ComponentFixture<FEdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FEdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FEdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
