import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppError } from '../common/app-error';
import { BadInput } from '../common/bad-input';
import { Unauthorized } from '../common/unauthorized';
import { AuthService } from '../services/auth.service';

import { DataService } from '../services/data.service';


@Component({
  selector: 'data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {
  form;
  loading = false;

  constructor(fb: FormBuilder, private service: DataService, private router: Router, private authService: AuthService) {
    this.form = fb.group({
      flow: ['', [Validators.required, Validators.min(1)]],
      pressure: ['', [Validators.required, Validators.min(1)]]
    })
  }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn())
      this.router.navigate(['/no-access']);
  }

  public addData(){
    this.loading = true;

    let one = this.form.value;
    /*console.log('data to post: ');
    console.log(one);
    this.service.create(this.form.value)
    .subscribe(
      newPost => {
        one['id'] = newPost.id;
        console.log("new id: " +  one['id']);
         // this.posts.splice(0, 0, post);
         this.router.navigate(['list']);
        },
        (error: AppError) => {
          if (error instanceof BadInput) {
            this.form.setErrors(error.originalError);
            console.log(error);
          }
          else throw error;
        });*/
    let isValid = this.service.create(this.form.value);

    if(!isValid){
      this.form.setErrors({
        invalidData: true
      })
    }else{
      isValid.subscribe(
        newPost => {
          one['id'] = newPost.id;
          //console.log("new id: " +  one['id']);
           // this.posts.splice(0, 0, post);

           this.router.navigate(['list']);
          },
          (error: AppError) => {
            if (error instanceof BadInput) {
              this.form.setErrors(error.originalError);
              //console.log(error);
            }
            else if (error instanceof Unauthorized) {
              this.router.navigate(['/no-access']);
            }
            else throw error;
          });
    }
  }

  get flow(){
    return this.form.get('flow');
  }

  get pressure(){
    return this.form.get('pressure');
  }


}
