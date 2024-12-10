import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/courseServices.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent implements OnInit {
  courseForm!:FormGroup
  allCategories: any[] = []
  selectedFile: File | null = null;
  courseId: number = 0;
  loginUserId: number = 0;
  loginUser: number = 0;
  receivedData: any
  idDict: any


  constructor(private service: CourseService,private route:ActivatedRoute,private router:Router ) {

  }
  ngOnInit(){
    
    this.initaizeForm();
    this.loadInitailData();
    this.route.queryParams.subscribe(params => {
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
      this.router.navigate(['']);
    }
      if (this.courseId) {
        this.service.getCourseById(this.courseId).subscribe({
          next: (data) => {
            console.log(data);
            this.courseForm.patchValue({
              courseTitle:data.courseTitle,
              courseDesc:data.courseDesc,
              category:data.category,
              courseThumb:data.courseThumb
            })
          }
        })
      } 
  }

  loadInitailData(){
    this.service.getCategories().subscribe(data => {
      this.allCategories = data;
      console.log(this.allCategories);
    })
  }

  initaizeForm() {
    this.courseForm = new FormGroup({
      courseTitle: new FormControl('', [Validators.required]),
      courseDesc: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      courseThumb: new FormControl(null,)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Store the selected file for uploading
      console.log("File selected:", file);
    }
  }
  
  onSubmit() {
    this.courseForm.markAllAsTouched();
    if (this.courseForm.invalid) {
      console.log("Form is invalid");
      return;
    }
    
    const formData = new FormData();
    formData.append("courseTitle", this.courseForm.get("courseTitle")?.value);
    formData.append("courseDesc", this.courseForm.get("courseDesc")?.value);
    formData.append("category", this.courseForm.get("category")?.value);
    if (this.selectedFile) {
      formData.append("courseThumb", this.selectedFile);
    }
    
    console.log("Form data being sent:", this.courseForm.value);
  
    this.service.updateCourse(this.courseId, formData).subscribe(
      (data) => {
        console.log("Course updated successfully:", data);
        this.viewCourses();
      },
      (error) => {
        console.error("Error updating course:", error);
      }
    );
  }
  
  viewCourses(){
    this.idDict = { 'loginUserId': this.loginUserId, 'courseId': this.courseId,  'loginUser': this.loginUser };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.router.navigate(['viewcourses'], { queryParams: { data: encodedData } });
  }
}
