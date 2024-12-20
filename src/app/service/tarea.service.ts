import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private baseUrl = environment.apiUrl;
  
    private tarea: string = `${this.baseUrl}/tarea`;
  
    constructor(private http: HttpClient) { }
  
    listarTarea(): Observable<any>{
      return this.http.get(`${this.tarea}`);
    }
  
    obtenerTarea(id: number): Observable<any>{
      return this.http.get(`${this.tarea}/${id}`);
    }
  
    registrarTarea(request: any, idTarea: number): Observable<any> {
      return this.http.post(`${this.tarea}?id_tarea=${idTarea}`, request);
    }
    
  
    editarTarea(id: number, request: any): Observable<any>{
      return this.http.put(`${this.tarea}/${id}`, request);
    }
  
    eliminarTarea(id: number): Observable<any>{
      return this.http.delete(`${this.tarea}/${id}`);
    }
  
}
