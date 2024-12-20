import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { ProyectosService } from 'src/app/service/proyectos.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;


@Component({
  selector: 'app-invitacion',
  templateUrl: './invitacion.component.html',
  styleUrls: ['./invitacion.component.css']
})

export class InvitacionComponent implements OnInit {

  listaProyectos: any[] = []
  formProyecto: FormGroup
  title: any
  nameBoton: any
  id: number

  constructor(
    private _proyectoserivce: ProyectosService,
    private _loginService : LoginService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  logout(){
      Swal.fire({
        title: '¿Estás seguro de cerrar sesion?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this._loginService.logout()
          this.route.navigate(['login'])
        }
      });

  }
}
