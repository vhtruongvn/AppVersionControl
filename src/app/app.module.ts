import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AppVersion } from '@ionic-native/app-version';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { HTTP } from '@ionic-native/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UpdatePage } from '../pages/update/update';
import { NetworkPage } from '../pages/network/network';
import { ShareService } from '../pages/services/ShareService';
import { NetworkService } from '../pages/services/NetworkService';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    UpdatePage,
    NetworkPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    UpdatePage,
    NetworkPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion,
    Storage,
    Network,
    HTTP,
    ShareService,
    NetworkService,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
