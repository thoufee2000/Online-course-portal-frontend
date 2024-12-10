import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { CourseComponent } from './course/course.component';
import { CourseViewComponent } from './course-view/course-view.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { UsercourseviewComponent } from './usercourseview/usercourseview.component';
import { SinglecourseviewComponent } from './singlecourseview/singlecourseview.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { EnrollmentManagementComponent } from './enrollment-management/enrollment-management.component';
import { UserEnrollmentComponent } from './user-enrollment/user-enrollment.component';
import { EditEnrollmentComponent } from './edit-enrollment/edit-enrollment.component';

const routes: Routes = [
  {path:'adduser',component:UserFormComponent},
  {path:'addcourses',component:CourseComponent},
  {path:'viewcourses',component:CourseViewComponent},
  {path:'editcourse',component:EditCourseComponent},
  {path:'usercourseview',component:UsercourseviewComponent},
  {path:'singlecourse',component:SinglecourseviewComponent},
  {path:'',component:UserLoginComponent},
  {path:'enrollmentmanagement',component:EnrollmentManagementComponent},
  {path:'userenrollment',component:UserEnrollmentComponent},
  {path:'updateenrollment',component:EditEnrollmentComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
