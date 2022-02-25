import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ColectionEditPage } from '../colection-edit/colection-edit.page';
import { FirebaseApp } from '@angular/fire';
import { Colection } from '../class/colection';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabuleiros',
  templateUrl: './tabuleiros.page.html',
  styleUrls: ['./tabuleiros.page.scss'],
})
export class TabuleirosPage implements OnInit {
  colectionEdit = ColectionEditPage;
  boards: any[] = [/*'','','',''*/]; // change to boards

  constructor(
    private modalController: ModalController,
    private fbApp: FirebaseApp,
    public router: Router
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
        this.boards.push(res.data.data);
    });

    return await modal.present();
  }
}
