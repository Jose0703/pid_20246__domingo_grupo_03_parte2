import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-recuperar-usuario',
  templateUrl: './recuperar-usuario.component.html',
  styleUrls: ['./recuperar-usuario.component.css']
})
export class RecuperarUsuarioComponent implements OnInit {

  usuario: any[] = []
  formLogin: FormGroup

  constructor(
    private _loginService : LoginService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.formLogin = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })
  }

  login(){
    if(this.formLogin.valid){
      console.log("Acceso", this.formLogin.value)
      this._loginService.ingresar(this.formLogin.value)
      .subscribe({
        next: (res) => {
          console.log("Response: ", res)
          this.route.navigate(['/home'])
        },
        error: (err: HttpErrorResponse) => {
          this.alertaError()
        }
      });
    }
  }

  alertaError(){
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Correo o contraseña incorrecta ",
      showConfirmButton: false,
      timer: 1500
    });
    this.formLogin.reset();
  }

}
