import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  private baseUrl = environment.apiUrl;

  private usuarioUrl = `${this.baseUrl}/usuarios`;  // Solo una URL

  constructor(private http: HttpClient) { }

  
  
  listarUsuario(): Observable<any>{
    return this.http.get(`${this.usuarioUrl}`);
  }

  obtenerUsuario(id: number): Observable<any>{
    return this.http.get(`${this.usuarioUrl}/${id}`);
  }
  registrarUsuario(request: any): Observable<any> {
    return this.http.post(this.usuarioUrl, request);  // Corrige la URL para registrar
  }
  

  editarUsuario(id: number, request: any): Observable<any>{
    return this.http.put(`${this.usuarioUrl}/${id}`, request);
  }

  eliminarUsuario(id: number): Observable<any>{
    return this.http.delete(`${this.usuarioUrl}/${id}`);
  }


}
