import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private baseUrl = environment.apiUrl;
  private proyectoUrl = `${this.baseUrl}/proyecto`;  // Solo una URL

  constructor(private http: HttpClient) { }

  listarProyecto(): Observable<any> {
    return this.http.get(this.proyectoUrl);  // Usamos tareaUrl directamente
  }

  obtenerProyecto(id: number): Observable<any>{
    return this.http.get(`${this.proyectoUrl}/${id}`);
  }

  registrarProyecto(request: any, idProyecto: number): Observable<any> {
    return this.http.post(`${this.proyectoUrl}?id_proyecto=${idProyecto}`, request);
  }
  

  editarProyecto(id: number, request: any): Observable<any>{
    return this.http.put(`${this.proyectoUrl}/${id}`, request);
  }

  eliminarProyecto(id: number): Observable<any>{
    return this.http.delete(`${this.proyectoUrl}/${id}`);
  }

}
