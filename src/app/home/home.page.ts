import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ColectionEditPage } from '../colection-edit/colection-edit.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  colectionEdit = ColectionEditPage;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async editCollection(){
    const modal = await this.modalController.create({
      component: this.colectionEdit,
      cssClass: 'colectionEditPageClass',
    });
    return await modal.present();
  }
}
