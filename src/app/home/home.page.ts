import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ColectionEditPage } from '../colection-edit/colection-edit.page';
import { FirebaseApp } from '@angular/fire';
import { Colection } from '../class/colection';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  colectionEdit = ColectionEditPage;
  colecList: Colection[] = [];

  constructor(
    private modalController: ModalController,
    private fbApp: FirebaseApp
    ) {}

  ngOnInit() {
    // this.fbApp.database().ref('nome').once('value').then((snapshot) => {
    //   console.log(snapshot.val());
    // });
  }

  async editCollection(){
    const modal = await this.modalController.create({
      component: this.colectionEdit,
      cssClass: 'colectionEditPageClass',
    });

    modal.onDidDismiss().then((res) => {
      if(res.data.data !== null)
        this.colecList.push(res.data.data);
    });

    return await modal.present();
  }
}
