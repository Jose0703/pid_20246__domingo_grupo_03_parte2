import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private baseUrl = environment.apiUrl;

  private proyectos: string = `${this.baseUrl}/proyecto`;

  constructor(private http: HttpClient) { }

  listarProyecto(): Observable<any>{
    return this.http.get(`${this.proyectos}`);
  }

  obtenerProyecto(id: number): Observable<any>{
    return this.http.get(`${this.proyectos}/${id}`);
  }

  registrarProyecto(request: any, idUsuario: number): Observable<any> {
    return this.http.post(`${this.proyectos}?id_usuario=${idUsuario}`, request);
  }
  

  editarProyecto(id: number, request: any): Observable<any>{
    return this.http.put(`${this.proyectos}/${id}`, request);
  }

  eliminarProyecto(id: number): Observable<any>{
    return this.http.delete(`${this.proyectos}/${id}`);
  }

}
