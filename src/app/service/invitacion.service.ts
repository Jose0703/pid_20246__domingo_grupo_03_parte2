import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitacionService {

  private baseUrl = environment.apiUrl;

  private invitaciones: string = `${this.baseUrl}/invitacion`;

  constructor(private http: HttpClient) { }

  listarInvitacion(): Observable<any>{
    return this.http.get(`${this.invitaciones}`);
  }

  obtenerInvitacion(id: number): Observable<any>{
    return this.http.get(`${this.invitaciones}/${id}`);
  }

  registrarInvitacion(request: any, idInvitacion: number): Observable<any> {
    return this.http.post(`${this.invitaciones}?id_invitacion=${idInvitacion}`, request);
  }
  

  editarInvitacion(id: number, request: any): Observable<any>{
    return this.http.put(`${this.invitaciones}/${id}`, request);
  }

  eliminarInvitacion(id: number): Observable<any>{
    return this.http.delete(`${this.invitaciones}/${id}`);
  }

}
