/**
* https://angular.io/guide/router
* Manejador de rutas
* este archivo esta diseñado para para definir lar rutas que pueden ser usadas por mi aplicación
*/

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//importo los componentes de mi aplicación para luego definir sus respectivas rutas
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent} from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PublicationComponent } from './components/publication/publication.component';
import { ProfileComponent } from './components/profile/profile.component';

//este es el arreglo encargado de definir las rutas para cada vista
const appRoutes: Routes =[
		{path:'', component: HomeComponent},
		{path:'home', component: HomeComponent},
		{path:'login', component: LoginComponent},
		{path:'register', component: RegisterComponent},
		{path:'user-edit', component: UserEditComponent},
		{path:'users/:page', component: UsersComponent},
		{path:'users', component: UsersComponent},
		{path:'timeline', component: TimelineComponent},
		{path:'publications', component: PublicationComponent},
		{path:'perfil/:id', component: ProfileComponent},
		{path:'**', component: HomeComponent},
	];
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);