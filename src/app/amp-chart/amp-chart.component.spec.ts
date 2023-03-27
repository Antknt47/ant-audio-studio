import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmpChartComponent } from './amp-chart.component';

describe('AmpChartComponent', () => {
  let component: AmpChartComponent;
  let fixture: ComponentFixture<AmpChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmpChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmpChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
