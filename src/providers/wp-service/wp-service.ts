import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WpServiceProvider {

  apiLoginUrl = 'https://www.partageapp.com/api/user/fb_connect/?access_token=';
  apiMetaUrl = 'https://www.partageapp.com/api/user/get_user_meta/?cookie=';
  metaUpdateUrl = 'https://www.partageapp.com/api/user/update_user_meta_vars/?cookie=';
  possibleConnectionsUrl = 'https://www.partageapp.com/api/user/get_possible_connections/?cookie=';

  constructor(public http: HttpClient) {}

  loginOrRegisterFacebook(fbToken) {
      return this.http.get(this.apiLoginUrl+fbToken);
  }

  getUserMeta(userCookie) {
      return this.http.get(this.apiMetaUrl+userCookie);
  }

  updateMeta(userCookie, values) {
      return this.http.get( this.metaUpdateUrl+userCookie+values);
  }

    getPossibleConnections(userCookie) {
        return this.http.get(this.possibleConnectionsUrl+userCookie);
    }

}
