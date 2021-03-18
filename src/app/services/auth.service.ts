import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService, private router: Router) {
  }

  /*login(credentials) {
   return this.http.post('http://localhost:8000/api/auth',
      JSON.stringify(credentials))
      .pipe(map((response: any) => {
        let result = response;
        if(result && result.token){
          localStorage.setItem('token', result.token);
          return true;
        }
        return false;
      }));
  }*/

  signin(credentials): Observable<any> {
    return this.http.post("https://aquasight-backend-api.herokuapp.com/api/auth" + '/login', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  /*logout() {
    localStorage.removeItem('token');
  }*/

  logout(){
    this.tokenStorageService.signOut();
  }

  isLoggedIn() {
    return this.tokenStorageService.getToken()!==null;
  }

  /*get currentUser(){
    let token = localStorage.getItem('token');
    if(!token) return null;
    //return new JwtHelper().decodeToken('token');
    return null;
  }*/
}

