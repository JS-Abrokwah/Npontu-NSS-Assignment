import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  closeResult = '';
  loginForm!:FormGroup;
  registerForm!:FormGroup

  constructor(private fb:FormBuilder, private modalService: NgbModal) {}

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:[null,[Validators.email,Validators.required]],
      password:[null,[Validators.required]]
    });

    this.registerForm = this.fb.group({
      firstName:[null,[Validators.required]],
      lastName:[null,[Validators.required]],
      email:[null,[Validators.email,Validators.required]],
      password:[null,[Validators.required,Validators.minLength(6)]],
      confirmPassword:[null,[Validators.required]],
      role:['Admin']
    })
  }

  //loginForm getters
  get getEmail(){
    return this.loginForm.get('email');
  }
  get getPassword(){
    return this.loginForm.get('password')
  }

  //Regitration getters
  get firstName(){
    return this.registerForm.get('firstName')
  }
  get lastName(){
    return this.registerForm.get('lastName')
  }
  get email(){
    return this.registerForm.get('email')
  }
  get password(){
    return this.registerForm.get('password')
  }
  get confirmPassword(){
    return this.registerForm.get('confirmPassword')
  }


}
