import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-modal-page',
    templateUrl: 'modal-page.html',
})
export class ModalPage {

    toDisplay: any;
    modalTitle: string;

    constructor(private navParams: NavParams, private view: ViewController) {
    }

    ionViewWillLoad() {
        this.toDisplay = this.navParams.get('data');
        this.modalTitle = this.navParams.get('title');
        console.log('butts');
        console.log(this.toDisplay);



    }

    closeModal() {

        this.view.dismiss();
    }
}