import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private baseUrl = environment.apiUrl;
  private tareaUrl = `${this.baseUrl}/tarea`;  // Solo una URL

  constructor(private http: HttpClient) { }

  listarTarea(): Observable<any> {
    return this.http.get(this.tareaUrl);  // Usamos tareaUrl directamente
  }

  obtenerTarea(id: number): Observable<any> {
    return this.http.get(`${this.tareaUrl}/${id}`);
  }

  registrarTarea(request: any): Observable<any> {
    return this.http.post(this.tareaUrl, request);  // Corrige la URL para registrar
  }

  editarTarea(id: number, request: any): Observable<any> {
    return this.http.put(`${this.tareaUrl}/${id}`, request);
  }

  eliminarTarea(id: number): Observable<any> {
    return this.http.delete(`${this.tareaUrl}/${id}`);
  }
}
