import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { AppError } from '../common/app-error';
import { Unauthorized } from '../common/unauthorized';


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {
  private url = 'https://aquasight-backend-api.herokuapp.com';

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

  }

  getAll(){
    return this.httpClient
      .get(this.url + '/list')
      .pipe(map((response: any) => response))
      .pipe(catchError(this.handleError));
  }

  getByDateRange(start: string, end: string ){
    return this.httpClient
      .get(this.url + '/list?start='+start + '&end='+end)
      .pipe(map((response: any) => response))
      .pipe(catchError(this.handleError));
  }

  create(resource){
    console.log('inside service:')
    console.log(resource);
    return this.httpClient.post(this.url+'/add', resource)
    .pipe(map((response: any) => response))
    .pipe(catchError(this.handleError));
  }

  private handleError(error: Response){
    if(error.status === 400){
      return throwError(new BadInput(error));
    }
    if(error.status === 401){
      return throwError(new Unauthorized(error));
    }

    if(error.status === 404)
      return throwError(new NotFoundError());

    return throwError(new AppError(error));
  }



}
