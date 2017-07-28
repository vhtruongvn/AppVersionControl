import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ShareService } from '../services/ShareService';
import { AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, private shareService: ShareService,
              public alertCtrl: AlertController, public platform: Platform, private iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  showAppUpdateAlert() {
    var storeName = 'App Store';
    if (this.platform.is('android')) {
      storeName = 'Google Play';
    }
    let confirm = this.alertCtrl.create({
      title: 'Update Available',
      subTitle: 'Current version: ' + this.shareService.getFullAppVersion(),
      message: 'A newer version ' + this.shareService.getFullLatestAppVersion() + ' of this app is available for download. Please update it from ' + storeName + '.',
      buttons: [
        {
          text: 'Later',
          handler: () => {
            console.log('Later clicked');
          }
        },
        {
          text: 'Update',
          handler: () => {
            console.log('Update clicked');
            confirm.dismiss().then(() => {
              // TODO: replace the link by app url on app store or google play
              let browser = this.iab.create('https://google.com/', '_system');
              browser.show();
            })
          }
        }
      ],
      enableBackdropDismiss: false
    });
    confirm.present();
  }

}
