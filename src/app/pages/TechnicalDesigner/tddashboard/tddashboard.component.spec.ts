import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TDdashboardComponent } from './tddashboard.component';

describe('TDdashboardComponent', () => {
  let component: TDdashboardComponent;
  let fixture: ComponentFixture<TDdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TDdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TDdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
