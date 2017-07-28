import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

export enum ConnectionStatusEnum {
  Online,
  Offline,
  Unknown
}

@Injectable()
export class NetworkService {
  private previousStatus;

  constructor(private eventCtrl: Events, private network: Network) {
    this.previousStatus = ConnectionStatusEnum.Unknown;
  }

  public initNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      console.log('Connection went offline');

      if (this.previousStatus !== ConnectionStatusEnum.Offline) {
        this.eventCtrl.publish('network:offline');
      }
      this.previousStatus = ConnectionStatusEnum.Offline;
    });

    this.network.onConnect().subscribe(() => {
      console.log('Connection went online');

      if (this.previousStatus !== ConnectionStatusEnum.Online) {
        this.eventCtrl.publish('network:online');
      }
      this.previousStatus = ConnectionStatusEnum.Online;

      setTimeout(() => {
        console.log('Connected to a ' + this.network.type + ' connection');
      }, 3000);
    });
  }

  getNetworkStatus() {
    switch (this.previousStatus) {
      case ConnectionStatusEnum.Online:
        return 'Online'
      case ConnectionStatusEnum.Offline:
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

}
