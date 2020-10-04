import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  templateUrl:'./signup.component.html',
  styleUrls:['./signup.component.css']
})
export class SignupComponent implements OnInit , OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }

    this.isLoading = false;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(() =>{
      authStatus =>{
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
