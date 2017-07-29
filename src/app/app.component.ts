import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { HTTP } from '@ionic-native/http';
import { LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { UpdatePage } from '../pages/update/update';
import { NetworkPage } from '../pages/network/network';
import { ShareService } from '../pages/services/ShareService';
import { NetworkService } from '../pages/services/NetworkService';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  modal: any = null;
  modalPage:any = null;
  tryAgainAlert:any = null;

  // The app should not function if the user is 2 releases behind
  // Feel free to change the 3 values below for testing
  fakeLatestAppVersionAPI:string = 'https://jsonplaceholder.typicode.com/posts/1';
  fakeLatestAppVersion:string = '0.0.1';
  fakeLatestAppBuildNumber:string = '0.0.4';
  maxVersionDiff = 2; // the app should not function if the user is 2 or 3 releases behind

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public alertCtrl: AlertController, private appVersion: AppVersion,
              private http: HTTP, public loadingCtrl: LoadingController,
              private shareService: ShareService, private networkService: NetworkService,
              private iab: InAppBrowser, private eventCtrl: Events, public modalCtrl: ModalController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Init network events
      this.networkService.initNetworkEvents();

      // watch network for a disconnect
      this.eventCtrl.subscribe('network:offline', () => {
        // Show NetworkPage with offline status
        console.log('network:offline event received');

        this.showModal(NetworkPage);
      });

      // watch network for a connection
      this.eventCtrl.subscribe('network:online', () => {
        console.log('network:online event received');

        if (this.shareService.getForceUpdate()) {
          this.showModal(UpdatePage);
        } else {
          this.dismissModal(); // if any present
          this.dismissTryAgainAlert(); // if present
        }

        if (this.shareService.getFailedToCheckAppVersion() && !this.shareService.isCheckingAppVersion()) {
          this.getLatestAppVersion();
        }
      });

      // get local app version & build number
      this.appVersion.getAppName().then((appName) => {
        this.shareService.setAppName(appName);
      });
      this.appVersion.getVersionCode().then((versionCode) => {
        this.shareService.setAppVersion(versionCode);
        this.checkForAppUpdate();
      });
      this.appVersion.getVersionNumber().then((versionNumber) => {
        this.shareService.setAppBuildNumber(versionNumber);
        this.checkForAppUpdate();
      });

      // Request backend api for app version & build number
      this.getLatestAppVersion();
    });
  }

  /* Thera are 2 workarounds to check for the latest app version from App Store or Google Play
   * 1. iOS: http://itunes.apple.com/lookup?bundleId=YOURBUNDLEID
   *    Android: https://play.google.com/store/apps/details?id=PACKAGENAME"
   *    (not recommended because these apis are not official)
   * 2. Backend API (recommended)
   *    Input: bundle id for ios or package name for android
   *    Ouput (for ex): {
   *      ios: {
   *        version: 0.0.1, // starting from 0.0.1
   *        build: 0.0.1 // starting from 0.0.1
   *      },
   *      android: {
   *        version: 0.0.1,
   *        build: 0.0.2
   *      }
   *    }
   */
  getLatestAppVersion() {
    this.shareService.setCheckingAppVersion(true); // turn on checkingAppVersion flag

    let loader = this.loadingCtrl.create({
      content: 'Checking app version...'
    });
    loader.present().then(() => {
      this.http.get(this.fakeLatestAppVersionAPI, {}, {})
      .then(data => {
        loader.dismiss();

        // TODO: parse json data for app version & build number
        console.log(data.status);

        this.shareService.setCheckingAppVersion(false); // turn off checkingAppVersion flag
        this.shareService.setFailedToCheckAppVersion(false); // turn off failedToCheckAppVersion flag

        // Here, i hardcode the app version & build number after calling backend api
        this.shareService.setLatestAppVersion(this.fakeLatestAppVersion);
        this.shareService.setLatestAppBuildNumber(this.fakeLatestAppBuildNumber);

        // Compare app versions & build numbers
        this.checkForAppUpdate();
      })
      .catch(error => {
        loader.dismiss();

        console.log(error);

        this.shareService.setCheckingAppVersion(false); // turn off checkingAppVersion flag
        this.shareService.setFailedToCheckAppVersion(true); // turn on failedToCheckAppVersion flag

        this.showTryAgainAlert();
      });
    });
  }

  checkForAppUpdate() {
    if (this.shareService.getFullAppVersion() === '' || this.shareService.getFullLatestAppVersion() === '') {
      return;
    }

    let appVersionDiff = this.shareService.getLatestAppVersion_Integer() - this.shareService.getAppVersion_Integer();
    let appBuildNumberDiff = this.shareService.getLatestAppBuildNumber_Integer() - this.shareService.getAppBuildNumber_Integer();
    if (appVersionDiff === 0 && appBuildNumberDiff === 0) {
      this.shareService.setAppUpToDate(true); // turn on appUpToDate flag
      this.showAlert('', 'The app is up-to-date', true); // dismiss after 1 second
    } else if (appVersionDiff > this.maxVersionDiff || appBuildNumberDiff > this.maxVersionDiff) {
      this.shareService.setForceUpdate(true); // turn on forceUpdate flag
      this.showModal(UpdatePage); // show UpdatePage as modal to force update
      setTimeout(() => {
        this.showAppUpdateAlert();
      }, 300);

      if (this.platform.is('android')) {
        this.platform.registerBackButtonAction(function(e) {
          // this will restrict the user to close the modal by pressing back key
          e.preventDefault();
        }, 401);
      }
    } else {
      // there is new app update but the current version is working fine
      this.showAppUpdateAlert();
    }
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

  showTryAgainAlert() {
    if (this.tryAgainAlert ===  null) {
      this.tryAgainAlert = this.alertCtrl.create({
        title: 'Oops',
        message: 'Unable to check the app version',
        buttons: [
          {
            text: 'Try Again',
            handler: () => {
              this.tryAgainAlert.dismiss().then(() => {
                this.getLatestAppVersion();
              })
            }
          }
        ],
        enableBackdropDismiss: false
      });
    }
    this.tryAgainAlert.present();
  }

  dismissTryAgainAlert() {
    if (this.tryAgainAlert !==  null) {
      this.tryAgainAlert.dismiss();
    }
  }

  showAlert(title, message, autoDismiss = false) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();

    if (autoDismiss) {
      setTimeout(() => {
        alert.dismiss();
      }, 1000);
    }
  }

  showModal(page) {
    if (this.modalPage !== null && this.modalPage === page) { // prevent from showing the same modal page
      return
    }

    if (this.modal !==  null) {
      this.modal.dismiss();
    }

    this.modalPage = page;

    this.modal = this.modalCtrl.create(page);
    this.modal.present();
  }

  dismissModal() {
    if (this.modal !==  null) {
      this.modal.dismiss();
    }
  }

}

