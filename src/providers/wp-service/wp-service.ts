import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class WpServiceProvider {

    apiLoginUrl = 'https://www.partageapp.com/api/user/fb_connect/?access_token=';
    apiMetaUrl = 'https://www.partageapp.com/api/user/get_user_meta/?cookie=';
    metaUpdateUrl = 'https://www.partageapp.com/api/user/update_user_meta_vars/?cookie=';
    possibleConnectionsUrl = 'https://www.partageapp.com/api/user/get_possible_connections/?cookie=';
    queueUrl = 'https://www.partageapp.com/api/user/get_queue/?cookie=';
    ajaxUrl = 'https://www.partageapp.com/wp-admin/admin-ajax.php';
    thumbsResultUrl = 'https://www.partageapp.com/api/user/get_accept_reject/?cookie=';
    uploadUrl = 'https://www.partageapp.com/api/user/upload_image/?cookie=';
    imagesUrl = 'https://www.partageapp.com/api/user/get_profile_images/?cookie=';
    updateGalleryUrl = 'https://www.partageapp.com/api/user/update_gallery/?cookie=';
    verifyUrl = 'https://www.partageapp.com/api/user/is_verfied/?cookie=';
    verifyImageUrl = 'https://www.partageapp.com/api/user/verify_image/?cookie=';

    constructor(public http: HttpClient) {

    }

    loginOrRegisterFacebook(fbToken) {
        return this.http.get(this.apiLoginUrl + fbToken);
    }

    getUserMeta(userCookie) {
        return this.http.get(this.apiMetaUrl + userCookie);
    }

    updateMeta(userCookie, values) {
        return this.http.get(this.metaUpdateUrl + userCookie + values);
    }

    getPossibleConnections(userCookie) {
        return this.http.get(this.possibleConnectionsUrl + userCookie);
    }

    getQueue(userCookie) {
        return this.http.get(this.queueUrl + userCookie);
    }

    uploadImage(userCookie, image, location) {
        return this.http.get( this.uploadUrl + userCookie + '&image=' + image + '&location=' + location);
    }

    getImages(userCookie, gallery) {
        console.log('correct function');
        return this.http.get( this.imagesUrl + userCookie + '&gallery=' + gallery);
    }
    updateGallery(userCookie, gallery, images) {
        return this.http.get( this.updateGalleryUrl + userCookie + '&gallery=' + gallery + '&images='+images);
    }
    isVerified(userCookie) {
        return this.http.get( this.verifyUrl + userCookie);
    }
    verifyImage(userCookie, image) {
        return this.http.get( this.verifyImageUrl + userCookie + '&image=' + image);
    }

    postRequestAcceptReject(result, connection_id, user, userCookie) {

        /*
        let headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');

        let postParams = {
            result: result,
            connection_id: connection_id,
            user: user,
            action: "accept_reject"
        };
        */

        /*
        this.http.post(this.ajaxUrl, postParams, {headers: headers})
            .subscribe(data => {
                console.log(data);
            }, error => {
                console.log(error);// Error getting the data
            });
            */
        return this.http.get(this.thumbsResultUrl + userCookie+'&choice='+result+'&connection='+connection_id);
    }

}

