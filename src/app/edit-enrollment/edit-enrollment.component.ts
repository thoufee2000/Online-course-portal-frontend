import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/courseServices.service';

@Component({
  selector: 'app-edit-enrollment',
  templateUrl: './edit-enrollment.component.html',
  styleUrl: './edit-enrollment.component.css'
})
export class EditEnrollmentComponent implements OnInit {
  enrollForm!: FormGroup

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: CourseService) {

  }

  receivedData: any;
  courseId: number = 0;
  loginUserId: number = 0;
  loginUser: number = 0;
  enrollmentId: number = 0;
  idDict: any;

  ngOnInit(): void {
    this.initialForm();

    this.loadInitialData();

  }

  initialForm() {
    this.enrollForm = new FormGroup({
      name: new FormControl('', Validators.required),
      enrollDate: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      course: new FormControl('', Validators.required)
    })
  }

  loadInitialData() {
    this.route.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log('Received Data:', this.receivedData);

          this.enrollmentId = this.receivedData['enrollmentId'];
          this.courseId = this.receivedData['courseId'];
          this.loginUserId = this.receivedData['loginUserId'];
          this.loginUser = this.receivedData['loginUser'];
        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });

    if (this.enrollmentId) {
      console.log(this.enrollmentId);
      this.service.getEnrollById(this.enrollmentId).subscribe((data) => {

        console.log(data);
        this.enrollForm.patchValue({
          name: data[0].name,
          enrollDate: data[0].enrollmentDate,
          status: data[0].status,
          course: data[0].courseTitle
        })
      })
    }
  }

  onSubmit() {
    console.log(this.enrollForm.value)
    this.service.updateEnroll(this.enrollmentId, this.enrollForm.value).subscribe((data) => {
      console.log(data);
    })
  }

  goBack(){
    
    this.idDict = { loginUserId: this.loginUserId, courseId: this.courseId, loginUser: this.loginUser, enrollmentId:this.enrollmentId };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.router.navigate(['enrollmentmanagement'], { queryParams: { data: encodedData } });

  }
}
