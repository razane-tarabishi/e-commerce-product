import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { ToastComponent } from './components/toast/toast.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddCardComponent } from './components/add-card/add-card.component';
import { SalleComponent } from './components/salle/salle.component';
import { LikeComponent } from './components/like/like.component';
import { PrimeNgComponent } from './components/prime-ng/prime-ng.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AddCarouselComponent } from './components/add-carousel/add-carousel.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { OrdersComponent } from './components/orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LayoutComponent,
    ContactComponent,
    AboutComponent,
    LoginComponent,
    ToastComponent,
    AddCardComponent,
    HomeComponent,
    SalleComponent,
    LikeComponent,
    PrimeNgComponent,
    CarouselComponent,
    AddCarouselComponent,
    ProductDetailsComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
