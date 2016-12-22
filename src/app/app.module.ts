import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TreeModule } from 'angular2-tree-component';
import { MaterialModule } from '@angular/material';
// import { Ng2MaterialModule } from 'ng2-material';
import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { AddressComponent } from './address/address.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { ValidationService } from './validation-service';
import { ContactServiceService } from './contact-service.service';
import { PhoneComponent } from './phone/phone.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { MsComponent, billingInfoDialog } from './ms/ms.component';
import {FilterArrayPipe} from './filter.pipe';

@NgModule({
    declarations: [
        AppComponent,
        ContactFormComponent,
        AddressComponent,
        ControlMessagesComponent,
        PhoneComponent,
        NavbarComponent,
        HomeComponent,
        MsComponent,
        billingInfoDialog,
        FilterArrayPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule.forRoot(),
        ReactiveFormsModule,
        TreeModule, routing
    ],
    providers: [ValidationService,ContactServiceService],
    entryComponents: [
        billingInfoDialog
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
