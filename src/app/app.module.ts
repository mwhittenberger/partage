import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { IonicStorageModule } from '@ionic/storage';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MyAccountPage } from '../pages/my-account/my-account';
import { PossibleConnectionsPage } from '../pages/possible-connections/possible-connections';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { WpServiceProvider } from '../providers/wp-service/wp-service';
import { Geolocation } from '@ionic-native/geolocation';
//import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MyAccountPage,
    PossibleConnectionsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    //Geolocation
    //Validators,
    //FormBuilder,
   // FormGroup,
   //FormControl
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    MyAccountPage,
    PossibleConnectionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    WpServiceProvider,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}

  ]
})
export class AppModule {}
