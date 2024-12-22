import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitacionService {

  private baseUrl = environment.apiUrl;
  private invitacionUrl = `${this.baseUrl}/invitacion`;  // Solo una URL

  constructor(private http: HttpClient) { }

  listarInvitacion(): Observable<any>{
    return this.http.get(`${this.invitacionUrl}`);
  }

  obtenerInvitacion(id: number): Observable<any>{
    return this.http.get(`${this.invitacionUrl}/${id}`);
  }

  registrarInvitacion(request: any, idUsuario: number): Observable<any> {
    return this.http.post(`${this.invitacionUrl}?id_usuario=${idUsuario}`, request);
  }

  editarInvitacion(id: number, request: any): Observable<any>{
    return this.http.put(`${this.invitacionUrl}/${id}`, request);
  }

  eliminarInvitacion(id: number): Observable<any>{
    return this.http.delete(`${this.invitacionUrl}/${id}`);
  }

}
