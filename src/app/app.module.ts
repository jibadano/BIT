import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { MenuComponent } from './base/menu/menu.component';
import { SearchComponent } from './base/search/search.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { RouterModule, Routes }   from '@angular/router';
import { ErrorComponent } from './base/error/error.component';
import {AppService} from './app.service';
import { EnvironmentComponent } from './base/environment/environment.component';
import { IssueComponent } from './base/issue/issue.component';
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'issue/:id',  component: IssueComponent },
  { path: 'issue',  component: IssueComponent },
  { path: '**',  component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SearchComponent,
    HomeComponent,
    NotFoundComponent,
    ErrorComponent,
    EnvironmentComponent,
    IssueComponent
  
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    ModalModule.forRoot()
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
