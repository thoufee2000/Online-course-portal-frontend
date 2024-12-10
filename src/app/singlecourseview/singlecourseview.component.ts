import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/courseServices.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-singlecourseview',
  templateUrl: './singlecourseview.component.html',
  styleUrl: './singlecourseview.component.css'
})
export class SinglecourseviewComponent implements OnInit {
  courseId: number = 0;
  receivedData: any;
  loginUser: number = 0;
  loginUserId: number = 0;
  idDict: any;

  currentCourse: any = {
    courseTitle: '',
    courseDesc: '',
    category: '',
    courseThumb: ''
  };

  constructor(
    private service: CourseService,
    private route: Router,
    private activateroute: ActivatedRoute) { }

  ngOnInit() {
    this.activateroute.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

          this.courseId = this.receivedData['courseId'];
          this.loginUserId = this.receivedData['loginUserId']
          this.loginUser = this.receivedData['loginUser']

        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });
    if(this.loginUser!=2){
      this.route.navigate(['']);
    }

    this.service.getCourseById(this.courseId).subscribe({
      next: (data) => {
        this.currentCourse = data;
        console.log(this.currentCourse);
      }
    })
  }


  getImageUrl(url: string): string {
    if (url && !url.startsWith('http')) {
      return `http://127.0.0.1:8000/${url}`;
    }
    return url || '';
  }

  // handleImageError(event: any) {
  //   console.error('Image load failed:', event.target.src);
  // }

  data: any = {};
  // In your Angular component
courseEnroll() {
  // Validate required parameters
  if (!this.courseId || !this.loginUserId) {
    console.error('Missing courseId or loginUserId.');
    alert('Invalid course or user information');
    return;
  }

  // Prepare enrollment data
  const enrollmentData = {
    userId: this.loginUserId,
    Id: this.courseId
  };

  // Perform course enrollment
  const confirmation = confirm('Are you sure you want to enroll this course?');
    if (confirmation) {
      this.service.courseEnroll(enrollmentData).subscribe({
        next: (response: any) => {
          // Check for success message in the response
          if (response && response.message) {
            alert(response.message);
            
          } else {
            alert('Enrolled Successfully');
            this.goBack();
          }
        },
        error: (err: any) => {
          // Handle different types of errors
          if (err.error && err.error.message) {
            // Backend returned an error message
            alert(err.error.message);
          } else if (err.message) {
            // Generic error message
            alert(err.message);
          } else {
            // Fallback error message
            alert('An error occurred during enrollment');
          }
          // console.error('Enrollment error:', err);
        }
      });
  
    }
  
}

  goBack() {
    this.idDict = { 'loginUserId': this.loginUserId, 'courseId': this.courseId, 'loginUser': this.loginUser };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['usercourseview'], { queryParams: { data: encodedData } });
  }
}
