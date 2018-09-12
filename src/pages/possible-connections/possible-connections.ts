import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {WpServiceProvider} from "../../providers/wp-service/wp-service";
import {Storage} from '@ionic/storage';
import {Observable} from "rxjs/Observable";
import {Modal, ModalController, ModalOptions} from 'ionic-angular';
import { ToastController } from 'ionic-angular';


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
    theResult: Observable<any>;
    userCookie: string;
    count: number;
    partnershipIdIndex: number;
    partnershipId: number;
    thisPartnership: object;
    initials: string;
    distance: string;
    relationship: string;
    possibleConnections: object;
    totalConnections: number;
    profileGallery: object;
    herDeats: any;
    hisDeats: object;
    validated: boolean;
    isDisabled: boolean = true;
    partner1: string;
    partner2: string;
    tempTitle: string;
    tempObject: object;
    verified: any = 'hideVerified';
    profileCard: any = 'showCard';
    matches: any = 'hasmatches';
    wpUserId: any;
    skipme: any = [];

    constructor(public toast: ToastController, public navCtrl: NavController, public navParams: NavParams, public wpService: WpServiceProvider, public storage: Storage, private modal: ModalController) {
        this.storage.get('fbToken').then((val) => {
            this.fbToken = val;
            this.wpUser = this.wpService.loginOrRegisterFacebook(this.fbToken);
            this.wpUser.subscribe(data => {
                console.log('my data ', data);

                this.userCookie = data.cookie;
                this.wpUserId = data.wp_user_id;

                this.connections = this.wpService.getPossibleConnections(this.userCookie);
                this.connections.subscribe(
                    data => {
                        console.log('my connections ', data);
                        this.storage.set('possibleConnections', data);
                        this.possibleConnections = data;
                        this.count = 0;
                        this.partnershipIdIndex = this.count + 1;
                        this.thisPartnership = data[this.count];
                        this.partnershipId = data[this.partnershipIdIndex];
                        //console.log(this.thisPartnership['initials']);
                        this.possibleConnections = data;
                        this.totalConnections = data['count'];
                    },
                    error => console.log("Error: ", error),
                    () => {

                        if(this.totalConnections == 0) {
                            this.profileCard = 'hideCard';
                            this.matches = 'nomatches';
                        }
                        else {
                            console.log(this.thisPartnership['initials']);
                            this.updateView();
                        }


                    }
                );
            });
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PossibleConnectionsPage');
    }

    updateView() {
        this.initials = this.thisPartnership['initials'];
        this.distance = this.thisPartnership['distance'];
        this.relationship = this.thisPartnership['duration'];
        this.profileGallery = this.thisPartnership['profile_gallery'];
        this.herDeats = this.thisPartnership['her_deats'];
        this.partner1 = this.herDeats['header'];
        this.hisDeats = this.thisPartnership['his_deats'];
        this.partner2 = this.hisDeats['header'];
        this.validated = this.thisPartnership['verified'];
        console.log('this.validated is '+this.validated);
        this.isDisabled = false;
        if(this.validated == true) {
            this.verified = 'showVerified';
            console.log('couple is verified');
        }
        else {
            this.verified = 'hideVerified';
            console.log('couple is not verified');
        }


    }


    next() {
        this.count = this.count + 2;
        this.partnershipIdIndex = this.count + 1;
        if (this.count == this.totalConnections) {
            this.count = 0;
            this.partnershipIdIndex = this.count + 1;
        }

        if(this.skipme.indexOf(this.partnershipIdIndex) > -1) {
            this.next();
        }
        else {


            this.thisPartnership = this.possibleConnections[this.count];
            this.partnershipId = this.possibleConnections[this.partnershipIdIndex];
            this.updateView();
        }


        console.log('next clicked');
    }

    thumbsup() {
        console.log('sending: interested, '+this.partnershipId+', '+this.wpUserId);
        this.theResult = this.wpService.postRequestAcceptReject('interested', this.partnershipId, this.wpUserId, this.userCookie);
        this.theResult.subscribe(
            data => {
                console.log('the result! ', data);
            }
            );
        const toast = this.toast.create({
            message: 'We will alert your partner that you have expessed interest in this couple. The couple will be moved to your Queue.',
            duration: 5000
        });
        toast.present();
        this.skipme.push(this.partnershipIdIndex);
        if(this.skipme.length == (this.totalConnections/2)) {
            this.profileCard = 'hideCard';
            this.matches = 'nomatches';
        }
        else {
            console.log('skipme is'+this.skipme);
            this.next();
        }

    }
    thumbsdown() {
        console.log('sending: pass, '+this.partnershipId+', '+this.wpUserId);
        this.theResult = this.wpService.postRequestAcceptReject('pass', this.partnershipId, this.wpUserId, this.userCookie);
        this.theResult.subscribe(
            data => {
                console.log('the result! ', data);
            }
        );
        const toast = this.toast.create({
            message: 'We will alert your partner that you have passed on this couple. The couple will be removed from your list.',
            duration: 5000
        });
        toast.present();
        this.skipme.push(this.partnershipIdIndex);
        if(this.skipme.length == (this.totalConnections/2)) {
            this.profileCard = 'hideCard';
            this.matches = 'nomatches';
        }
        else {
            console.log('skipme is'+this.skipme);
            this.next();
        }
    }

    openModal(gender, partner) {

        const myModalOptions: ModalOptions = {
            enableBackdropDismiss: true
        };

        if(gender == 'Her' && partner == 'partner1') {
            this.tempObject = this.herDeats;
            this.tempTitle = 'About Her';
        }
        if(gender == 'Him' && partner == 'partner1') {
            this.tempObject = this.herDeats;
            this.tempTitle = 'About Him';
        }
        if(gender == 'Her' && partner == 'partner2') {
            this.tempObject = this.hisDeats;
            this.tempTitle = 'About Her';
        }
        if(gender == 'Him' && partner == 'partner2') {
            this.tempObject = this.hisDeats;
            this.tempTitle = 'About Him';
        }

        const myModal: Modal = this.modal.create('ModalPage', {data: this.tempObject, title: this.tempTitle}, myModalOptions);

        myModal.present();

    }

}

