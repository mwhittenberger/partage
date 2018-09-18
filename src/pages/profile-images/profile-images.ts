import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import {WpServiceProvider} from "../../providers/wp-service/wp-service";
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import {Observable} from "rxjs";
import {Storage} from '@ionic/storage';
import { reorderArray } from 'ionic-angular';

declare var cordova: any;

@Component({
    selector: 'page-profile-images',
    templateUrl: 'profile-images.html'
})
export class ProfileImagesPage {
    lastImage: string = null;
    loading: Loading;
    wpUser: Observable<any>;
    uploaded: Observable<any>;
    returnedGallery: Observable<any>;
    fbToken: string;
    userCookie: string;
    profileGallery: any;
    testImage: any;
    imagesArray: Array<{any}>;
    imagesIdArray: Array<{any}>;
    imagesArray2: Array<{any}>;
    imagesIdArray2: Array<{any}>;
    hideVerify: any = 'hideVerify';


    constructor(public wpService: WpServiceProvider, public navCtrl: NavController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public storage: Storage) {
        //console.log('grabbing profile images');
        this.storage.get('fbToken').then((val) => {
            this.fbToken = val;
            this.wpUser = this.wpService.loginOrRegisterFacebook(this.fbToken);
            this.wpUser.subscribe(data => {
                this.userCookie = data.cookie;
                this.get_gallery('profile');
                this.get_gallery('private');
                this.isVerified();
            });
        });

    }

    public isVerified() {
        this.wpService.isVerified(this.userCookie).subscribe( verifydata => {
            console.log('verfied?: '+verifydata);
            if (verifydata === false) {
                this.hideVerify = 'showVerify';
            }
        });
    }

    public reorderItems(indexes) {
        this.imagesIdArray = reorderArray(this.imagesIdArray, indexes);

        this.imagesArray = reorderArray(this.imagesArray, indexes);
        console.log('here:'+JSON.stringify(indexes));
        console.log('there:'+this.imagesIdArray);
        let numbers = '';

        for(let i=0; i<this.imagesIdArray.length; i++){
           numbers = numbers+this.imagesIdArray[i]+',';
        }
        numbers = numbers.slice(0, -1);
        this.wpService.updateGallery(this.userCookie, 'profile', numbers).subscribe( images => {
           console.log(images);
        });
    }

    public reorderItems2(indexes) {
        this.imagesIdArray2 = reorderArray(this.imagesIdArray2, indexes);

        this.imagesArray2 = reorderArray(this.imagesArray2, indexes);
        let numbers = '';

        for(let i=0; i<this.imagesIdArray2.length; i++){
            numbers = numbers+this.imagesIdArray2[i]+',';
        }
        numbers = numbers.slice(0, -1);
        this.wpService.updateGallery(this.userCookie, 'private', numbers).subscribe( images => {
            console.log(images);
        });
    }

    public removeItem(item, gallery) {


        let numbers = '';

        if(gallery == 'profile') {
            let index = this.imagesArray.indexOf(item);
            if(index > -1){
                this.imagesArray.splice(index, 1);
            }

            if(index > -1){
                this.imagesIdArray.splice(index, 1);
            }
            for(let i=0; i<this.imagesIdArray.length; i++){
                numbers = numbers+this.imagesIdArray[i]+',';
            }
            numbers = numbers.slice(0, -1);
            this.wpService.updateGallery(this.userCookie, 'profile', numbers).subscribe( images => {
                console.log(images);
            });
        }
        else {
            let index = this.imagesArray2.indexOf(item);
            if(index > -1){
                this.imagesArray2.splice(index, 1);
            }

            if(index > -1){
                this.imagesIdArray2.splice(index, 1);
            }
            for(let i=0; i<this.imagesIdArray2.length; i++){
                numbers = numbers+this.imagesIdArray2[i]+',';
            }
            numbers = numbers.slice(0, -1);
            this.wpService.updateGallery(this.userCookie, 'private', numbers).subscribe( images => {
                console.log(images);
            });
        }
    }

    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        // Get the data of an image
        this.camera.getPicture(options).then((imagePath) => {
            // Special handling for Android library
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        }, (err) => {
            this.presentToast('Error while selecting image.');
        });
    }

    // Create a new name for the image
    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName =  n + ".jpg";
        return newFileName;
    }

    ionViewDidLoad() {

    }

// Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

// Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }

    public uploadImage(location) {
        // Destination URL
        var url = "https://www.partageapp.com/upload.php";

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;

        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params : {'fileName': filename}
        };

        const fileTransfer: TransferObject = this.transfer.create();

        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();

        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
            this.loading.dismissAll()
            this.presentToast('Image succesfully uploaded.');
            this.storage.get('fbToken').then((val) => {
                this.fbToken = val;
                this.wpUser = this.wpService.loginOrRegisterFacebook(this.fbToken);
                this.wpUser.subscribe(data => {
                    console.log('my data '+ data);
                    this.userCookie = data.cookie;
                    this.uploaded = this.wpService.uploadImage(this.userCookie, filename, location);
                    this.uploaded.subscribe( data2 => {
                        console.log('upload data '+ data2);

                    },
                    error => console.log("Error: ", error),
                    () => {
                        console.log('uploading is down, refresh now');

                        this.get_gallery('profile');
                        this.get_gallery('private');
                        this.lastImage = null;
                        this.presentToast('uploading is down, refresh now');
                    });
                });
            });
        }, err => {
            console.log(err);
            this.loading.dismissAll()
            this.presentToast('Error while uploading file.');
        });
    }

    public verifyAccount() {
        // Destination URL
        var url = "https://www.partageapp.com/upload.php";

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;

        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params : {'fileName': filename}
        };

        const fileTransfer: TransferObject = this.transfer.create();

        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();

        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
            this.loading.dismissAll()
            this.presentToast('Verification image succesfully uploaded.');
            this.storage.get('fbToken').then((val) => {
                this.fbToken = val;
                this.wpUser = this.wpService.loginOrRegisterFacebook(this.fbToken);
                this.wpUser.subscribe(data => {
                    console.log('my data '+ data);
                    this.userCookie = data.cookie;
                    this.wpService.verifyImage(this.userCookie, filename);
                    //this.uploaded.subscribe( data2 => {console.log('upload data '+ data2);});
                });
            });
        }, err => {
            console.log(err);
            this.loading.dismissAll()
            this.presentToast('Error while uploading file.');
        });
    }

    public get_gallery(gallery) {

        this.returnedGallery = this.wpService.getImages(this.userCookie, gallery);
        this.returnedGallery.subscribe(images => {

                this.profileGallery = images;


                //console.log('test image is'+this.testImage['sizes']['thumbnail']);
            },
            error => console.log("Error: ", error),
            () => {

                console.log('images ' + JSON.stringify(this.profileGallery));
                //this.testImage = this.profileGallery[0]['profile_image']['url'];
                //let count = this.profileGallery['count'];

                console.log('count is ' + Object.keys(this.profileGallery).length);

                let ourArray = [];
                let ourIds = [];
                let imageId = 0;

                //console.log('what '+this.testImage);
                for (let i = 0; i < Object.keys(this.profileGallery).length - 1; i++) {
                    //console.log('image '+i+' is '+this.profileGallery[i]['profile_image']['url']);
                    if (gallery == 'profile') {
                        this.testImage = this.profileGallery[i]['profile_image']['url'];
                        imageId = this.profileGallery[i]['profile_image']['id'];
                    }
                    else {
                        this.testImage = this.profileGallery[i]['private_images']['url'];
                        imageId = this.profileGallery[i]['private_images']['id'];
                    }


                    ourIds[i] = imageId;

                    if (this.testImage != undefined)
                        ourArray[i] = this.testImage;
                }

                if (gallery == 'profile') {
                    this.imagesArray = ourArray;
                    this.imagesIdArray = ourIds;
                }
                else {
                    this.imagesArray2 = ourArray;
                    this.imagesIdArray2 = ourIds;
                }


                console.log('images array is ' + ourArray);

            });

    }
}