import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {WpServiceProvider} from "../../providers/wp-service/wp-service";
import {Storage} from '@ionic/storage';
import {Observable} from "rxjs/Observable";


/**
 * Generated class for the PossibleConnectionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-possible-connections',
  templateUrl: 'possible-connections.html',
    providers: [WpServiceProvider],
})
export class PossibleConnectionsPage {

  fbToken: string;
  wpUser: Observable<any>;
  connections: Observable<any>;
  userCookie: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public wpService: WpServiceProvider,public storage: Storage) {
      this.storage.get('fbToken').then((val) => {
          this.fbToken = val;
          this.wpUser = this.wpService.loginOrRegisterFacebook(this.fbToken);
          this.wpUser.subscribe(data => {
              console.log('my data ', data);

              this.userCookie = data.cookie;

              this.connections = this.wpService.getPossibleConnections(this.userCookie);
              this.connections.subscribe(
                  data => {
                      console.log('my connections ', data);

                  },
                  error => console.log("Error: ", error),
                  () => {}
              );
          });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PossibleConnectionsPage');
  }

}
