import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DomesticComponent } from './pages/service/domestic/domestic.component';
import { InternationalComponent } from './pages/service/international/international.component';
import { AirComponent } from './pages/service/air/air.component';
import { CargoComponent } from './pages/service/cargo/cargo.component';
import { SurfaceComponent } from './pages/service/surface/surface.component';
import { PriorityComponent } from './pages/service/priority/priority.component';
import { PriceComponent } from './pages/service/price/price.component';
import { VolumeComponent } from './pages/service/volume/volume.component';
import { PickupComponent } from './pages/request/pickup/pickup.component';
import { QuoteComponent } from './pages/request/quote/quote.component';
import { AboutComponent } from './pages/company/about/about.component';
import { ContactComponent } from './pages/company/contact/contact.component';
import { ReachComponent } from './pages/company/reach/reach.component';
import { TrackComponent } from './pages/track/track.component';
import { TermsComponent } from './pages/company/terms/terms.component';


const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full',
  },
  {
    path: 'home', component: HomeComponent,
  },
  {
    path: 'service/domestic', component: DomesticComponent,
  },
  {
    path: 'service/international', component: InternationalComponent,
  },
  {
    path: 'service/air', component: AirComponent,
  },
  {
    path: 'service/cargo', component: CargoComponent,
  },
  {
    path: 'service/surface', component: SurfaceComponent,
  },
  {
    path: 'service/priority', component: PriorityComponent,
  },
  {
    path: 'service/price', component: PriceComponent,
  },
  {
    path: 'service/volumetric-weight', component: VolumeComponent,
  },
  {
    path: 'service/volumetric-weight-calculation', component: VolumeComponent,
  },
  {
    path: 'service/pickup-request', component: PickupComponent,
  },
  {
    path: 'service/get-quote', component: QuoteComponent,
  },
  {
    path: 'contact', component: ContactComponent,
  },
  {
    path: 'about', component: AboutComponent,
  },
  {
    path: 'reach', component: ReachComponent,
  },
  {
    path: 'track', component: TrackComponent,
  },
  {
    path: 'terms-and-privacy', component: TermsComponent,
  },
  {
    path: '**', component: HomeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
