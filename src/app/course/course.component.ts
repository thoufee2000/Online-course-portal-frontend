import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/courseServices.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {
  courseForm!: FormGroup;
  allCourses: any[] = [];
  allCategories: any[] = [];
  selectedFile: File | null = null;
  receivedData: any;
  loginUserId: number = 0;
  loginUser: number = 0;
  idDict: any;
  courseId: number = 0;

  constructor(private service: CourseService,private route:Router,private router:ActivatedRoute) {}

  ngOnInit() {
    this.initializeForm();
    this.getInitialData();
    this.router.queryParams.subscribe(params => {
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
    if(this.loginUser!=1){
      this.route.navigate(['']);
    }
  }

  initializeForm() {
    this.courseForm = new FormGroup({
      courseTitle: new FormControl('', [Validators.required]),
      courseDesc: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      courseThumb: new FormControl(null, [Validators.required])
    });
  }

  getInitialData() {
    this.service.getCourses().subscribe((data) => {
      this.allCourses = data;
      console.log(this.allCourses);
    });

    this.service.getCategories().subscribe((data) => {
      this.allCategories = data;
      console.log(this.allCategories);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Get the actual file name, not the fakepath
      const fileName = file.name;
  
      // If you need the full path, use this approach
      const filePath = URL.createObjectURL(file);
  
      this.courseForm.patchValue({
        courseThumb: filePath  // Use the blob URL
      });
  
      this.selectedFile = file;
    }
  }
  
  onSubmit() {
    this.courseForm.markAllAsTouched();
    if (this.courseForm.valid && this.selectedFile) {
      const formData = new FormData();
      console.log(formData)
      formData.append('courseTitle', this.courseForm.get('courseTitle')?.value);
      formData.append('courseDesc', this.courseForm.get('courseDesc')?.value);
      formData.append('category', this.courseForm.get('category')?.value);
      formData.append('courseThumb', this.selectedFile);
  
      this.service.createCourse(formData).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.error('Error creating course', error);
        }
      );
    }
    this.viewCourses();
  }

  viewCourses(){
    this.idDict = { 'loginUserId': this.loginUserId, 'courseId': this.courseId,  'loginUser': this.loginUser };
      const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
      this.route.navigate(['viewcourses'], { queryParams: { data: encodedData } });
  }
}