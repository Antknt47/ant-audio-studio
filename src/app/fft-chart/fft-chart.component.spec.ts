import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FftChartComponent } from './fft-chart.component';

describe('FftChartComponent', () => {
  let component: FftChartComponent;
  let fixture: ComponentFixture<FftChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FftChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FftChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
