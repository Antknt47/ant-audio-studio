import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OscilloscopeComponent } from './oscilloscope/oscilloscope.component';
import { StateButtonComponent } from './state-button/state-button.component';
import { VolumeBarComponent } from './volume-bar/volume-bar.component';
import { FftChartComponent } from './fft-chart/fft-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    OscilloscopeComponent,
    StateButtonComponent,
    VolumeBarComponent,
    FftChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
