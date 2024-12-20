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
      fecVen: new FormControl(null, [Validators.required]),
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
  
        // Asegúrate de acceder a la clave correcta
        if (data && data.Tarea) {
          this.listaTarea = data.Tarea.map(tarea => ({
            ...tarea,
            proyecto: tarea.proyecto || 'Sin tarea asignada'
          }));
        } else {
          console.error("La API no devolvió los proyectos correctamente");
          this.listaTarea = [];
        }
      },
      (error) => {
        console.error("Error al llamar a la API:", error);
        this.listaTarea = [];
      }
    );
  }
  


    obtenerTareaPorId(id: any) {
      let form = this.formTarea
      this._tareaService.obtenerTarea(id)
        .subscribe((data) => {
          form.controls['nombre'].setValue(data.tarea.nombre)
          form.controls['descripcion'].setValue(data.tarea.descripcion)
          form.controls['fecVen'].setValue(data.tarea.fecVen)
          form.controls['desarrollado'].setValue(data.tarea.desarrollado)
          form.controls['prioridad'].setValue(data.tarea.prioridad)
          form.controls['comentarios'].setValue(data.tarea.comentarios)
          form.controls['proyecto'].setValue(data.tarea.proyecto)
          form.controls['usuario'].setValue(data.tarea.usuario)
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
              const idTarea = this._loginService.getIdUsuario(); // Obtener idUsuario dinámicamente
          
              // Crear el objeto request con los datos del formulario
              const request = {
                nombre: formulario.value.nombre,
                descripcion: formulario.value.descripcion,
                fecVen: formulario.value.fecVen,
                desarrollado: formulario.value.desarrollado,
                prioridad: formulario.value.prioridad,
                comentarios: formulario.value.comentarios,
                proyecto: formulario.value.proyecto,
                usuario: formulario.value.usuario,
              };
          
              // Llamar al servicio con el id_usuario
              this._tareaService.registrarTarea(request, idTarea).subscribe(
                (response) => {
                  console.log('Tarea registrad', response);
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
