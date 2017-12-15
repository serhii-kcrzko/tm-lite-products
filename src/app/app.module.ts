import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AUTH_PROVIDERS } from './auth.service';
import { BACKEND_PROVIDERS } from './backend.service';
import { LoggedInGuard } from './logged-in.guard';

import { AppComponent } from './app.component';
import { ItemComponent } from './item/item.component';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemEditFormComponent } from './item-edit-form/item-edit-form.component';
import { ItemListComponent } from './item-list/item-list.component';
import { LoginComponent } from './login/login.component';

import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

export function highchartsFactory() {
  const hc = require('highcharts');
  return hc;
}

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'show', component: ItemListComponent, canActivate: [LoggedInGuard], pathMatch: 'full'  },
  { path: 'show/:id', component: ItemComponent, pathMatch: 'full' },
  { path: 'add', component: ItemAddComponent, canActivate: [LoggedInGuard], pathMatch: 'full'  },
  { path: 'edit', component: ItemEditComponent, canActivate: [LoggedInGuard], pathMatch: 'full'  },
  { path: 'edit/:id', component: ItemEditFormComponent, pathMatch: 'full' },

  // login path
  { path: 'login', component: LoginComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    ItemAddComponent,
    ItemEditComponent,
    ItemEditFormComponent,
    ItemListComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    ChartModule
  ],
  providers: [
    AUTH_PROVIDERS,
    BACKEND_PROVIDERS,
    LoggedInGuard,
    AppComponent,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
