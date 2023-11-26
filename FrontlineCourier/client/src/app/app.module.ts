import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { ContactComponent } from './pages/company/contact/contact.component';
import { AboutComponent } from './pages/company/about/about.component';
import { ReachComponent } from './pages/company/reach/reach.component';
import { environment } from 'src/environments/environment';
import { TrackComponent } from './pages/track/track.component';

// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
// import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DomesticComponent,
    InternationalComponent,
    AirComponent,
    CargoComponent,
    SurfaceComponent,
    PriorityComponent,
    PriceComponent,
    VolumeComponent,
    PickupComponent,
    QuoteComponent,
    ContactComponent,
    AboutComponent,
    ReachComponent,
    TrackComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideFirestore(() => getFirestore()),
    // provideAnalytics(() => getAnalytics()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
