import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { ProyectosService } from 'src/app/service/proyectos.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

    listaUsuario: any[] = []
    formUsuario: FormGroup
    title: any
    nameBoton: any
    id: number
  
    constructor(
      private _usuarioService: UsuarioService,
      private _loginService : LoginService,
      private route: Router
    ) { }
  
    ngOnInit(): void {
      this.initForm();
      this.obtenerUsuario();
    }
  
    initForm(){
      this.formUsuario = new FormGroup({
        nombre: new FormControl(null, [Validators.required]),
        apellido: new FormControl(null, [Validators.required]),
        direccion: new FormControl(null, [Validators.required]),
        dni: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required]),
        rol: new FormControl(null, [Validators.required]),
        telefono: new FormControl(null, [Validators.required])
      })
    }

    obtenerUsuario() {
      this._usuarioService.listarUsuario().subscribe(
        (response) => {
          console.log("Datos recibidos desde la API:", response);
    
          // Verifica si la respuesta contiene las invitaciones en una propiedad específica
          if (response && Array.isArray(response.usuarios)) {
            this.listaUsuario = response.usuarios.map((usuario: any) => ({
              id_usuario: usuario.id_usuario,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              direccion: usuario.direccion,
              dni: usuario.dni,
              email: usuario.emaipasswordl,
              password: usuario.email,
              rol: usuario.rol,
              telefono: usuario.telefono
            }));
          } else {
            console.error("La API no devolvió un arreglo de invitaciones.");
            this.listaUsuario = [];
          }
        },
        (error) => {
          console.error("Error al llamar a la API:", error);
          this.listaUsuario = [];
        }
      );
    }

    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  
    obtenerUsuarioPorId(id: any) {
      let form = this.formUsuario
      this._usuarioService.obtenerUsuario(id)
        .subscribe((data) => {
          form.controls['nombre'].setValue(data.usuarios.nombre)
          form.controls['apellido'].setValue(data.usuarios.apellido)
          form.controls['direccion'].setValue(data.usuarios.direccion)
          form.controls['dni'].setValue(data.usuarios.dni)
          form.controls['email'].setValue(data.usuarios.email)
          form.controls['password'].setValue(data.usuarios.password)
          form.controls['rol'].setValue(data.usuarios.rol)
          form.controls['telefono'].setValue(data.usuarios.telefono)
          console.log(data.usuario)
        });
    }
    
    eliminarUsuario(id: any) {
      Swal.fire({
          title: '¿Estás seguro de eliminar esta tarea?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              this._usuarioService.eliminarUsuario(id)
                  .subscribe(
                      (data) => {
                          console.log("Usuario eliminado", data);
  
                          // Filtra la tarea eliminada correctamente
                          this.listaUsuario = this.listaUsuario.filter(item => item.id_usuario !== id);
  
                          // Muestra la alerta de éxito
                          this.alertaExitosa("elimnado");
                      },
                      error => {
                          console.error('Error al eliminar', error);
                      }
                  );
          }
      });
  }
  
  
  registrarUsuario(): void {
    if (this.formUsuario.valid) {
      const idUsuario = this._loginService.getIdUsuario();
  
      const request = {
        nombre: this.formUsuario.value.nombre,
        apellido: this.formUsuario.value.apellido,
        direccion: this.formUsuario.value.direccion,
        dni: this.formUsuario.value.dni,
        email: this.formUsuario.value.email,
        password: this.formUsuario.value.password,
        rol: this.formUsuario.value.rol,
        telefono: this.formUsuario.value.telefono,

      };
  
      this._usuarioService.registrarUsuario(request).subscribe(
        (response) => {
          console.log('Tarea registrada', response);
          this.cerrarModal();
          this.obtenerUsuario(); 
          this.formUsuario.reset();
        },
        (error) => {
          console.error('Error al registrar', error);
          let errorMessage = 'Error al registrar la tarea. Inténtalo de nuevo.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message; 
          }
          alert(errorMessage);
        }
      );
    } else {
      alert('Por favor, completa todos los campos del formulario antes de enviar.'); // Si el formulario no es válido
    }
  }
        editarUsuario(id: number, formulario: any): void {
          if (this.formUsuario.valid) {
            this._usuarioService.editarUsuario(id, formulario).subscribe(response => {
              this.cerrarModal()
              this.obtenerUsuario()
              this.resetForm()
              console.log('Usuario modificado', response);
            }, error => {
              console.error('Error al modificar', error);
            });
          }
        }
        
            titulo(titulo: any, id: number) {
              this.title = `${titulo} tarea`
              titulo == "Crear" ? this.nameBoton = "Guardar" : this.nameBoton = "Modificar"
              if (id != null) {
                this.id = id
                this.obtenerUsuarioPorId(id)
              }
            }
          
            crearEditarUsuario(boton: any) {
              if (boton == "Guardar") {
                this.alertRegistro()
              } else {
                this.alertModificar()
              }
            }
          
            cerrarModal() {
              const modalElement = document.getElementById('modalUsuario');
              const modal = bootstrap.Modal.getInstance(modalElement);
              modal.hide();
            }
          
            resetForm(): void {
              this.formUsuario.reset();
            }
          
            cerrarBoton() {
              this.resetForm()
              this.cerrarModal()
            }
        
            alertRegistro() {
                if (this.formUsuario.valid) {
                  Swal.fire({
                    title: '¿Estás seguro de registrar esta tarea?',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, confirmar',
                    cancelButtonText: 'Cancelar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.registrarUsuario()
                      this.alertaExitosa("registrado")
                    }
                  });
                }
            
              }
            
              alertModificar() {
                if (this.formUsuario.valid) {
                  Swal.fire({
                    title: '¿Estás seguro de modificar este Usuario?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, modificar',
                    cancelButtonText: 'Cancelar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.editarUsuario(this.id, this.formUsuario.value)
                      this.alertaExitosa("modificada")
                    }
                  });
                }
              }
            
              alertaExitosa(titulo: any){
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Tarea "+titulo,
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
  
