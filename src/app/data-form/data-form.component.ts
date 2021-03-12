import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent   {

  form = new FormGroup({
    flow: new FormControl('', [
      Validators.required
    ]),
    pressure: new FormControl('', Validators.required)
  })

  constructor() { }


  get flow(){
    return this.form.get('flow');
  }

  get pressure(){
    return this.form.get('pressure');
  }

}
