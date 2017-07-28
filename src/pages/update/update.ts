import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ShareService } from '../services/ShareService';

@Component({
  selector: 'page-update',
  templateUrl: 'update.html'
})
export class UpdatePage {
  constructor(public navCtrl: NavController, private shareService: ShareService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePage');
  }

  updateButtonClicked(event) {
    window.open('http://google.com', '_system'); // TODO: replace the link by app url on app store or google play
  }
}
