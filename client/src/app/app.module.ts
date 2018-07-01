/*
* configuracion general de mi app
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';

//importo mi manejador de rutas
import { routing, appRoutingProviders} from './app.routing'

//importo mis modulos para que puedan ser usados por mi aplicación
import { AppComponent } from './app.component';
import { NameComponent } from './name/name.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent} from './components/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PublicationComponent } from './components/publication/publication.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MessageComponent } from './components/messages/message.component';

//cofiguración de mi app
@NgModule({
  declarations: [
    AppComponent,
    NameComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    PublicationComponent,
    ProfileComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    MomentModule,
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
