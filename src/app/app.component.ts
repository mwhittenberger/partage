import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {MyAccountPage} from "../pages/my-account/my-account";
import {PossibleConnectionsPage} from "../pages/possible-connections/possible-connections";
import {QueuePage} from "../pages/queue/queue";
import {ProfileImagesPage} from "../pages/profile-images/profile-images";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;
  myToken: string;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage,) {
    this.initializeApp();





        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: HomePage },
            { title: 'List', component: ListPage },
            {title: 'Manage Profile', component: MyAccountPage },
            { title: 'Manage Profile Images', component: ProfileImagesPage },
            {title: 'Possible Connections', component: PossibleConnectionsPage },
            {title: 'My Queue', component: QueuePage }
        ];




  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
        //this.storage.remove('fbToken');
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

    getStoredToken() {
        this.storage.get('fbToken').then((val) => {
            this.myToken = val;
        });
        console.log('token is '+this.myToken);
    }
}
