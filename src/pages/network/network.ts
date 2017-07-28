import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NetworkService } from '../services/NetworkService';

@Component({
  selector: 'page-network',
  templateUrl: 'network.html'
})
export class NetworkPage {
  constructor(public navCtrl: NavController, private networkService: NetworkService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NetworkPage');
  }

}
