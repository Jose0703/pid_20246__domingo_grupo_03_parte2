import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { InvitacionService } from 'src/app/service/invitacion.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;


@Component({
  selector: 'app-invitacion',
  templateUrl: './invitacion.component.html',
  styleUrls: ['./invitacion.component.css']
})

export class InvitacionComponent implements OnInit {
  listaInvitaciones: any[] = []
  formInvitacion: FormGroup
  title: any
  nameBoton: any
  id: number

  constructor(
    private _invitacionservice: InvitacionService,
    private _loginService : LoginService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.obtenerInvitaciones();
  }

  initForm(){
    this.formInvitacion = new FormGroup({
      proyecto: new FormControl(null, [Validators.required]),
      usuario: new FormControl(null, [Validators.required]),
      mensaje: new FormControl(null, [Validators.required]),
    })
  }

  obtenerInvitaciones() {
    this._invitacionservice.listarInvitacion().subscribe(
      (response) => {
        console.log("Datos recibidos desde la API:", response);
  
        // Verifica si la respuesta contiene las invitaciones en una propiedad específica
        if (response && Array.isArray(response.invitaciones)) {
          this.listaInvitaciones = response.invitaciones.map((invitacion: any) => ({
            id_invitacion: invitacion.id_invitacion,
            proyecto: invitacion.proyecto ? invitacion.proyecto.nombre : 'Sin proyecto asignado',
            usuario: invitacion.usuario ? `${invitacion.usuario.nombre} ${invitacion.usuario.apellido}` : 'Sin usuario asignado',
            mensaje: invitacion.mensaje || 'Sin mensaje',
            fecha: this.formatDate(invitacion.fecha || new Date().toISOString()),
          }));
        } else {
          console.error("La API no devolvió un arreglo de invitaciones.");
          this.listaInvitaciones = [];
        }
      },
      (error) => {
        console.error("Error al llamar a la API:", error);
        this.listaInvitaciones = [];
      }
    );
  }

  
  

    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }

  

  obtenerInvitacionPorId(id: any) {
    let form = this.formInvitacion
    this._invitacionservice.obtenerInvitacion(id)
      .subscribe((data) => {
        form.controls['proyecto'].setValue(data.invitaciones.proyecto)
        form.controls['usuario'].setValue(data.invitaciones.usuario)
        form.controls['mensaje'].setValue(data.invitaciones.mensaje)
        console.log(data.invitaciones)
      });
  }
/*
  eliminarInvitacion(id: any) {
      Swal.fire({
          title: '¿Estás seguro de eliminar esta tarea?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              this._invitacionservice.eliminarInvitacion(id)
                  .subscribe(
                      (data) => {
                          console.log("Tarea eliminada", data);
  
                          // Filtra la tarea eliminada correctamente
                          this.listaInvitaciones = this.listaInvitaciones.filter(item => item.id_invitacion !== id);
  
                          // Muestra la alerta de éxito
                          this.alertaExitosa("eliminada");
                      },
                      error => {
                          console.error('Error al eliminar', error);
                      }
                  );
          }
      });
  }
  */
    registrarInvitacion(formulario: any): void {
      if (this.formInvitacion.valid) {
        const idUsuario = this._loginService.getIdUsuario(); // Obtener idUsuario dinámicamente
      
        // Crear el objeto request con los datos del formulario
        const request = {
          proyecto: formulario.value.proyecto,
          usuario: formulario.value.usuario,
          mensaje: formulario.value.mensaje
        };
      
        // Llamar al servicio con el id_usuario
        this._invitacionservice.registrarInvitacion(request, idUsuario).subscribe(
          (response) => {
            console.log('Invitación registrada', response);
            this.cerrarModal();
            this.obtenerInvitaciones();
            this.resetForm();
          },
          (error) => {
            console.error('Error al registrar', error);
            alert('Error al registrar la invitación');
          }
        );
      } else {
        console.warn('Formulario inválido');
      }
    }
    
    
    
  
    editarInvitacion(id: number, formulario: any): void {
      if (this.formInvitacion.valid) {
        this._invitacionservice.editarInvitacion(id, formulario).subscribe(response => {
          this.cerrarModal()
          this.obtenerInvitaciones()
          this.resetForm()
          console.log('Proyecto modificado', response);
        }, error => {
          console.error('Error al modificar', error);
        });
      }
    }

    titulo(titulo: any, id: number) {
      this.title = `${titulo} invitacion`
      titulo == "Crear" ? this.nameBoton = "Guardar" : this.nameBoton = "Modificar"
      if (id != null) {
        this.id = id
        this.obtenerInvitacionPorId(id)
      }
    }
  
    crearEditarInvitacion(boton: any) {
      if (boton == "Guardar") {
        this.alertRegistro()
      } else {
        this.alertModificar()
      }
    }
  
    cerrarModal() {
      const modalElement = document.getElementById('modalInvitacion');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  
    resetForm(): void {
      this.formInvitacion.reset();
    }
  
    cerrarBoton() {
      this.resetForm()
      this.cerrarModal()
    }

    alertRegistro() {
        if (this.formInvitacion.valid) {
          Swal.fire({
            title: '¿Estás seguro de registrar este proyecto?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.registrarInvitacion(this.formInvitacion.value)
              this.alertaExitosa("registrado")
            }
          });
        }
    
      }
    
      alertModificar() {
        if (this.formInvitacion.valid) {
          Swal.fire({
            title: '¿Estás seguro de modificar esta invitacion?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, modificar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.editarInvitacion(this.id, this.formInvitacion.value)
              this.alertaExitosa("modificado")
            }
          });
        }
      }
    
      alertaExitosa(titulo: any){
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Producto "+titulo,
          showConfirmButton: false,
          timer: 1500
        });
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
