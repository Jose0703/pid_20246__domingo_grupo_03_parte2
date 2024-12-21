import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { TareaService } from 'src/app/service/tarea.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css']
})
export class TareaComponent implements OnInit {

  listaTarea: any[] = []
  formTarea: FormGroup
  title: any
  nameBoton: any
  id: number

  constructor(
    private _tareaService: TareaService,
    private _loginService : LoginService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.obtenerTarea();
  }

  initForm(){
    this.formTarea = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required]),
      fechaVencimiento: new FormControl(null, [Validators.required]),
      desarrollado: new FormControl(null, [Validators.required]),
      prioridad: new FormControl(null, [Validators.required]),
      comentarios: new FormControl(null, [Validators.required]),
      proyecto: new FormControl(null, [Validators.required]),
      usuario: new FormControl(null, [Validators.required])
    })
  }

  obtenerTarea() {
    this._tareaService.listarTarea().subscribe(
      (data) => {
        console.log("Datos recibidos desde la API:", data);
  
        if (data) {
          this.listaTarea = data.map((tarea: any) => ({
            id_tarea: tarea.id_tarea,
            nombre: tarea.nombre,
            descripcion: tarea.descripcion,
            fechaVencimiento: this.formatDate(tarea.fechaVencimiento),
            desarrollado: tarea.desarrollado,
            prioridad: tarea.prioridad,
            comentarios: Array.isArray(tarea.comentarios) ? tarea.comentarios : ['Sin comentarios'],
            proyecto: tarea.proyecto ? tarea.proyecto.nombre : 'Sin proyecto asignado',
            usuario: tarea.proyecto?.usuario ? `${tarea.proyecto.usuario.nombre} ${tarea.proyecto.usuario.apellido}` : 'Sin usuario asignado',
          }));
        } else {
          console.error("Error al procesar los datos.");
          this.listaTarea = [];
        }
      },
      (error) => {
        console.error("Error al llamar a la API:", error);
        this.listaTarea = [];
      }
    );
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  obtenerTareaPorId(id: any) {
    let form = this.formTarea
    this._tareaService.obtenerTarea(id)
      .subscribe((data) => {
        form.controls['nombre'].setValue(data.tareas.nombre)
        form.controls['descripcion'].setValue(data.tareas.descripcion)
        form.controls['fechaVencimiento'].setValue(data.tareas.fechaVencimiento)
        form.controls['desarrollado'].setValue(data.tareas.desarrollado)
        form.controls['prioridad'].setValue(data.tareas.prioridad)
        form.controls['comentarios'].setValue(data.tareas.comentarios)
        form.controls['proyecto'].setValue(data.tareas.proyecto)
        form.controls['usuario'].setValue(data.tareas.usuario)
        console.log(data.tarea)
      });
  }
  
    eliminarTarea(id: any) {
        Swal.fire({
          title: '¿Estás seguro de eliminar este proyecto?',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
    
            this._tareaService.eliminarTarea(id)
              .subscribe((data) => {
                console.log("Tarea eliminada", data)
                this.listaTarea = this.listaTarea.filter(item => item.id !== id);
              }, error => {
                console.error('Error al eliminar', error);
              });
    
              this.alertaExitosa("eliminada")
    
          }
        });
    
      }

      registrarTarea(formulario: any): void {
        if (this.formTarea.valid) {
          const idUsuario = this._loginService.getIdUsuario(); // Obtener idUsuario dinámicamente
      
          // Crear el objeto request con los datos del formulario
          const request = {
            nombre: formulario.value.nombre,
            descripcion: formulario.value.descripcion,
            fechaVencimiento: formulario.value.fechaVencimiento,
            desarrollado: formulario.value.desarrollado,
            prioridad: formulario.value.prioridad,
            proyecto: {
              idProyecto: formulario.value.proyecto, // Asegúrate de que `formulario.value.proyecto` contenga un ID
            },
            asignadoA: {
              id: idUsuario, // Enviar el ID del usuario asignado
            },
          };
      
          // Llamar al servicio con el objeto request
          this._tareaService.registrarTarea(request).subscribe(
            (response) => {
              console.log('Tarea registrada', response);
              this.cerrarModal();
              this.obtenerTarea();
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
      
          
          
        
      editarTarea(id: number, formulario: any): void {
        if (this.formTarea.valid) {
          this._tareaService.editarTarea(id, formulario).subscribe(response => {
            this.cerrarModal()
            this.obtenerTarea()
            this.resetForm()
            console.log('Proyecto modificado', response);
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
              this.obtenerTareaPorId(id)
            }
          }
        
          crearEditarTarea(boton: any) {
            if (boton == "Guardar") {
              this.alertRegistro()
            } else {
              this.alertModificar()
            }
          }
        
          cerrarModal() {
            const modalElement = document.getElementById('modalTarea');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
          }
        
          resetForm(): void {
            this.formTarea.reset();
          }
        
          cerrarBoton() {
            this.resetForm()
            this.cerrarModal()
          }
      
          alertRegistro() {
              if (this.formTarea.valid) {
                Swal.fire({
                  title: '¿Estás seguro de registrar esta tarea?',
                  icon: 'success',
                  showCancelButton: true,
                  confirmButtonText: 'Sí, confirmar',
                  cancelButtonText: 'Cancelar'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.registrarTarea(this.formTarea.value)
                    this.alertaExitosa("registrada")
                  }
                });
              }
          
            }
          
            alertModificar() {
              if (this.formTarea.valid) {
                Swal.fire({
                  title: '¿Estás seguro de modificar este proyecto?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Sí, modificar',
                  cancelButtonText: 'Cancelar'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.editarTarea(this.id, this.formTarea.value)
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
