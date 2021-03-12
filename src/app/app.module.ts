import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataFormComponent } from './data-form/data-form.component';
import { ViewDataComponent } from './view-data/view-data.component';

@NgModule({
  declarations: [
    AppComponent,
    DataFormComponent,
    ViewDataComponent
  ],
  exports: [
    DataFormComponent,
    ViewDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [  CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
