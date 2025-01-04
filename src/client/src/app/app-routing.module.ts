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
    data: { title: 'Home' }
  },
  {
    path: 'service/domestic', component: DomesticComponent,
    data: { title: 'Domestic Service' }
  },
  {
    path: 'service/international', component: InternationalComponent,
    data: { title: 'International Service' }
  },
  {
    path: 'service/air', component: AirComponent,
    data: { title: 'Air Service' }
  },
  {
    path: 'service/cargo', component: CargoComponent,
    data: { title: 'Cargo Service' }
  },
  {
    path: 'service/surface', component: SurfaceComponent,
    data: { title: 'Surface Service' }
  },
  {
    path: 'service/priority', component: PriorityComponent,
    data: { title: 'Priority Service' }
  },
  {
    path: 'service/price', component: PriceComponent,
    data: { title: 'Domestic Pricing' }
  },
  {
    path: 'service/volumetric-weight', component: VolumeComponent,
    data: { title: 'Volumetric Weight Calculation' }
  },
  {
    path: 'service/volumetric-weight-calculation', component: VolumeComponent,
    data: { title: 'Volumetric Weight Calculation' }
  },
  {
    path: 'service/pickup-request', component: PickupComponent,
    data: { title: 'Pickup Request' }
  },
  {
    path: 'service/get-quote', component: QuoteComponent,
    data: { title: 'Get Quote' }
  },
  {
    path: 'contact', component: ContactComponent,
    data: { title: 'Contact' }
  },
  {
    path: 'about', component: AboutComponent,
    data: { title: 'About' }
  },
  {
    path: 'reach', component: ReachComponent,
    data: { title: 'Reach Us' }
  },
  {
    path: 'track', component: TrackComponent,
    data: { title: 'Track' }
  },
  {
    path: 'terms-and-privacy', component: TermsComponent,
    data: { title: 'Policies' }
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
