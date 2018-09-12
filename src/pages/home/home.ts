import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import {Observable} from "rxjs/Observable";
import {WpServiceProvider} from "../../providers/wp-service/wp-service";
//import {WpServiceProvider} from "../../providers/wp-service/wp-service";
import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    isLoggedIn:boolean = false;
    users: any;
    myToken: string;
    userName: string;
    userEmail: string;
    lat: any;
    lng: any;
    wpUser: Observable<any>;
    userCookie: string;
    updateResult: Observable<any>;

  constructor(private fb: Facebook, public storage: Storage, public geolocation: Geolocation, public wpService: WpServiceProvider, public menuCtrl: MenuController) {
      fb.getLoginStatus()
          .then(res => {
              console.log(res.status);
              this.getStoredToken();
              if(res.status === "connect" || this.myToken != '') {
                  this.isLoggedIn = true;
                  console.log('logged in');
                  this.menuCtrl.swipeEnable( true );
                  this.wpUser = this.wpService.loginOrRegisterFacebook(this.myToken);
                  this.wpUser.subscribe(data => {

                      this.userCookie = data.cookie;
                      //this.updateResult = this.wpService.updateMeta(this.userCookie, '&latitude='+this.lat+'&longitude='+this.lng);
                      /*this.updateResult.subscribe(
                          data => {
                              console.log('lat and long update results: ', data);

                          });*/

                  });
              } else {
                  this.isLoggedIn = false;
                  console.log('not logged in');
              }
          })
          .catch(e => console.log(e));

  }

    ionViewDidLoad(){

        this.menuCtrl.swipeEnable( false );

        /*
        this.geolocation.getCurrentPosition().then( pos => {
            this.lat = pos.coords.latitude;
            this.lng = pos.coords.longitude;
        }).catch( err => console.log(err));
        */

        if(this.myToken != '') {
            //store geo data
            this.wpUser = this.wpService.loginOrRegisterFacebook(this.myToken);
            this.wpUser.subscribe(data => {

                this.userCookie = data.cookie;
                //this.updateResult = this.wpService.updateMeta(this.userCookie, '&latitude='+this.lat+'&longitude='+this.lng);
                /*this.updateResult.subscribe(
                    data => {
                        console.log('lat and long update results: ', data);

                    });*/

            });
        }

    }

  login() {

      console.log('log me in');
      this.fb.login(['public_profile', 'email'])
          .then(res => {
              if(res.status === "connected") {
                  this.isLoggedIn = true;
                  this.getUserDetail(res.authResponse.userID);
                  this.myToken = res.authResponse.accessToken;
                  this.storage.set('fbToken', this.myToken);

                  //store geo data
                  this.wpUser = this.wpService.loginOrRegisterFacebook(this.myToken);
                  this.wpUser.subscribe(data => {

                      this.userCookie = data.cookie;
                      //this.updateResult = this.wpService.updateMeta(this.userCookie, '&latitude='+this.lat+'&longitude='+this.lng);
                      /*this.updateResult.subscribe(
                          data => {
                              console.log('results ', data);

                          });*/

                  });

              } else {
                  this.isLoggedIn = false;
              }
          })
          .catch(e => console.log('Error logging into Facebook', e));
  }

  logout() {
      this.fb.logout()
          .then( res => this.isLoggedIn = false)
          .catch(e => console.log('Error logout from Facebook', e));
  }


  getUserDetail(userid) {
      this.fb.api("/"+userid+"/?fields=id,email,name",["public_profile"])
          .then(res => {
              console.log(res);
              this.users = res;
              this.userName = this.users.name;
              this.userEmail = this.users.email;
          })
          .catch(e => {
              console.log(e);
          });
  }

  getStoredToken() {
      this.storage.get('fbToken').then((val) => {
          this.myToken = val;
      });
      console.log('token is '+this.myToken);
  }

}
