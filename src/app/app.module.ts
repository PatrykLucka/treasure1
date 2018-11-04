import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SendFormComponent } from './send-form/send-form.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { UsersListComponent } from './users-list/users-list.component';
import { NewUserComponent } from './new-user/new-user.component';
import { ShopComponent } from './shop/shop.component';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
    { path: '', component: LoginScreenComponent },
    { path: 'buyers', component: UsersListComponent },
    { path: 'new-buyer/:id', component: NewUserComponent },
    { path: 'shop', component: ShopComponent },
  ];

@NgModule({
  declarations: [
    AppComponent,
    SendFormComponent,
    LoginScreenComponent,
    UsersListComponent,
    NewUserComponent,
    ShopComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    RouterModule.forRoot(
        appRoutes,
        { enableTracing: false } // <-- debugging purposes only
      ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
