import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api/api-service.service';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';



@Injectable({
  providedIn: 'root'
})
export class LoginService  {

  constructor(private apiService: ApiService , private userService :UserService , private router: Router) {
  }


  login(username: String, password: String) {
    const loginRequestBody = {
        "username": username,
        "password": password,
    };

    this.apiService.post<User>(ApiEndpoints.userLogin(), loginRequestBody)
      .subscribe({
        next: (response) => {
          const user: User = response.data; 
          this.userService.setUser(user);  
          this.router.navigate(['/homePage']);  
        },
        error: (error) => {
         console.log("Login api error"+error);
        }
      });
  }

 
 



}




