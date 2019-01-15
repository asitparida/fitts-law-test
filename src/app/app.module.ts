import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {TransferHttpCacheModule} from '@nguniversal/common';
import { AppRoutingModule } from './app.routing';
import { FittsTestComponent } from './fitts-test/fitts-test.component';
import { InfoComponent } from './info/info.component';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FittsTestComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    AppRoutingModule,
    TransferHttpCacheModule,
    FormsModule
  ],
  providers: [
    AppService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
