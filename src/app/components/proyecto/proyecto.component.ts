import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { ProyectosService } from 'src/app/service/proyectos.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

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
    this.initForm();
    this.obtenerProyectos();
  }

  initForm(){
    this.formProyecto = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required]),
      nombreUsuario: new FormControl(null, [Validators.required]),
    })
  }

  obtenerProyectos() {
    this._proyectoserivce.listarProyecto().subscribe(
      (data) => {
        console.log("Datos recibidos desde la API:", data);
  
        // Asegúrate de acceder a la clave correcta
        if (data && data.Proyectos) {
          this.listaProyectos = data.Proyectos.map(proyecto => ({
            ...proyecto,
            nombreUsuario: proyecto.nombreUsuario || 'Sin usuario asignado'
          }));
        } else {
          console.error("La API no devolvió los proyectos correctamente");
          this.listaProyectos = [];
        }
      },
      (error) => {
        console.error("Error al llamar a la API:", error);
        this.listaProyectos = [];
      }
    );
  }
  
  

  obtenerProyectoPorId(id: any) {
    let form = this.formProyecto
    this._proyectoserivce.obtenerProyecto(id)
      .subscribe((data) => {
        form.controls['nombre'].setValue(data.proyectos.nombre)
        form.controls['descripcion'].setValue(data.proyectos.descripcion)
        form.controls['nombreUsuario'].setValue(data.proyectos.nombreUsuario)
        console.log(data.proyectos)
      });
  }

  eliminarProyecto(id: any) {
      Swal.fire({
          title: '¿Estás seguro de eliminar este Proyecto?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              this._proyectoserivce.eliminarProyecto(id)
                  .subscribe(
                      (data) => {
                          console.log("Proyecto eliminado", data);
  
                          // Filtra la tarea eliminada correctamente
                          this.listaProyectos = this.listaProyectos.filter(item => item.id_proyecto !== id);
  
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
    registrarProyecto(formulario: any): void {
      if (this.formProyecto.valid) {
        const idUsuario = this._loginService.getIdUsuario(); // Obtener idUsuario dinámicamente
    
        // Crear el objeto request con los datos del formulario
        const request = {
          nombre: formulario.value.nombre,
          descripcion: formulario.value.descripcion
        };
    
        // Llamar al servicio con el id_usuario
        this._proyectoserivce.registrarProyecto(request, idUsuario).subscribe(
          (response) => {
            console.log('Proyecto registrado', response);
            this.cerrarModal();
            this.obtenerProyectos();
            this.resetForm();
          },
          (error) => {
            console.error('Error al registrar', error);
            alert('Error al registrar el proyecto');
          }
        );
      } else {
        console.warn('Formulario inválido');
      }
    }
    
    
  
    editarProyecto(id: number, formulario: any): void {
      if (this.formProyecto.valid) {
        this._proyectoserivce.editarProyecto(id, formulario).subscribe(response => {
          this.cerrarModal()
          this.obtenerProyectos()
          this.resetForm()
          console.log('Proyecto modificado', response);
        }, error => {
          console.error('Error al modificar', error);
        });
      }
    }

    titulo(titulo: any, id: number) {
      this.title = `${titulo} proyecto`
      titulo == "Crear" ? this.nameBoton = "Guardar" : this.nameBoton = "Modificar"
      if (id != null) {
        this.id = id
        this.obtenerProyectoPorId(id)
      }
    }
  
    crearEditarProyecto(boton: any) {
      if (boton == "Guardar") {
        this.alertRegistro()
      } else {
        this.alertModificar()
      }
    }
  
    cerrarModal() {
      const modalElement = document.getElementById('modalProyecto');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  
    resetForm(): void {
      this.formProyecto.reset();
    }
  
    cerrarBoton() {
      this.resetForm()
      this.cerrarModal()
    }

    alertRegistro() {
        if (this.formProyecto.valid) {
          Swal.fire({
            title: '¿Estás seguro de registrar este proyecto?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.registrarProyecto(this.formProyecto.value)
              this.alertaExitosa("registrado")
            }
          });
        }
    
      }
    
      alertModificar() {
        if (this.formProyecto.valid) {
          Swal.fire({
            title: '¿Estás seguro de modificar este proyecto?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, modificar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.editarProyecto(this.id, this.formProyecto.value)
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
