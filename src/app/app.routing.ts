import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ContactFormComponent } from './contact-form/contact-form.component';
import { HomeComponent } from './home/home.component';
import { MsComponent } from './ms/ms.component';



/*
import {ContactpageComponent} from './contactpage/contactpage.component';
import {HomepageComponent} from './homepage/homepage.component';

import {Contactform} from './customer/customer.component';

*/

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'cf', component: ContactFormComponent },
    { path: 'cf/:id', component: ContactFormComponent },
    { path: 'ms', component: MsComponent },
    { path: 'ms/:id/:tabIndex', component: MsComponent }
];



export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


/*************** 

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutpageComponent} from './aboutpage/aboutpage.component';
//import {ContactpageComponent} from './contactpage/contactpage.component';
import {HomepageComponent} from './homepage/homepage.component';
import {JumbotronComponent} from './jumbotron/jumbotron.component';
import {ArtistComponent} from './artist/artist.component';
import {AlbumComponent} from './album/album.component';
import {ScratchComponent} from './scratch/scratch.component';
import {CustomerComponent} from './customer/customer.component';


const appRoutes: Routes = [
    { path: '', component: JumbotronComponent }, 
    { path: 'hp', component: HomepageComponent },
    { path: 'ap', component: AboutpageComponent },
  //  { path: 'cp', component: ContactpageComponent },
    { path: 'sp', component: ScratchComponent },
    { path: 'cust', component: CustomerComponent },
    { path: 'artist/:id', component: ArtistComponent },
    { path: 'album/:id', component: AlbumComponent }
 ];
 
export const appRoutingProviders: any[] = [
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
*/