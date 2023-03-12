import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OscilloscopeComponent } from './oscilloscope/oscilloscope.component';
import { StateButtonComponent } from './state-button/state-button.component';

@NgModule({
  declarations: [
    AppComponent,
    OscilloscopeComponent,
    StateButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
