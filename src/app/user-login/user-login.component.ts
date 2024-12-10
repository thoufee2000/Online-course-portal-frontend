import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../services/courseServices.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit{
  loginForm!:FormGroup
  message:string='';
  loginUserId: number = 0;
  loginUser:number=0;
  idDict:any;
  receivedData: any;
  showPassword: boolean = false;

  constructor(
    private service: CourseService,
    private route:Router,
    private router:ActivatedRoute){}

  ngOnInit(){
    this.initializeForm();
    
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.service.userLogin(this.loginForm.value).subscribe((response: any) => {
        console.log('Login Successful', this.loginForm.value);
        // console.log(response)
        this.loginUserId = response['userId'];
        this.loginUser = response['user'];
        this.loginForm.reset();

        if (this.loginUser === 1) {
          
          this.idDict = { 'loginUserId': this.loginUserId, 'loginUser': this.loginUser };
          const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
          this.route.navigate(['viewcourses'], { queryParams: { data: encodedData } });
          
        }
        else if (this.loginUser === 2) {
          this.idDict = { 'loginUserId': this.loginUserId, 'loginUser': this.loginUser };
          const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
          this.route.navigate(['usercourseview'], { queryParams: { data: encodedData } });
        } 
      }, (error) => {
        this.message = 'Check Login Credentials and Try Again'
      });

    } else {
      this.loginForm.markAllAsTouched();
      console.log('Form is invalid', this.loginForm.value);
    }
  }

  initializeForm(){
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
