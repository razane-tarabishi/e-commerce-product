import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AddCardComponent } from './components/add-card/add-card.component';
import { SalleComponent } from './components/salle/salle.component';
import { LikeComponent } from './components/like/like.component';
import { AddCarouselComponent } from './components/add-carousel/add-carousel.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  { path: 'home', component: HomeComponent},
  {path:'contact',component:ContactComponent, canActivate: [authGuard] },
  {path:'about',component:AboutComponent, canActivate: [authGuard] },
  {path:'add-card',component:AddCardComponent, canActivate:[authGuard]},
  {path:'salle',component:SalleComponent, canActivate:[authGuard]},
  { path: 'like', component:LikeComponent, canActivate:[authGuard]},
  { path: 'add-carousel',component:AddCarouselComponent, canActivate:[authGuard]},
  {path:'orders',component:OrdersComponent, canActivate:[authGuard]},
   { path: 'product/:id',component:ProductDetailsComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' } 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
