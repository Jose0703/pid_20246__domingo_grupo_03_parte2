import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/auth/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthInterceptor } from './components/helpers/auth.interceptor';
import { AuthGuard } from './components/helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { RecuperarUsuarioComponent } from './components/recuperar-usuario/recuperar-usuario.component';
import { TareasComponent } from './components/views/tareas/tareas.component';
import { InvitacionComponent } from './components/invitacion/invitacion.component';
import { TareaComponent } from './components/tarea/tarea.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UsuarioComponent,
    RecuperarUsuarioComponent,
    TareasComponent,
    InvitacionComponent,
    ProyectoComponent,
    TareaComponent,
    UsuarioComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginComponent},
      {path: 'invitacion', component: InvitacionComponent},
      {path: 'proyecto', component: ProyectoComponent, canActivate: [AuthGuard]},
      {path: 'tarea', component : TareaComponent},
      {path: 'usuario', component: UsuarioComponent},
      {path: 'recuperar', component: RecuperarUsuarioComponent},
      
      {path: '', component: LoginComponent},
    ]),
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
