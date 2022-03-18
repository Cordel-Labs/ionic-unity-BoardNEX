import { Component, ViewChildren  } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ColectionEditPage } from '../colection-edit/colection-edit.page';
import { FirebaseApp } from '@angular/fire';
import { Colection } from '../class/colection';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  colectionEdit = ColectionEditPage;
  colecList: Colection[] = [];
  clickedCol: number;

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

  async editCollection(ind = -1){
    let colec = null;
    if(ind >= 0)
      colec = this.colecList[ind];
    const modal = await this.modalController.create({
      component: this.colectionEdit,
      cssClass: 'colectionEditPageClass',
      componentProps: {
        newColection: colec,
        colecInd: ind
      }
    });

    modal.onDidDismiss().then((res) => {
      console.log(res.data.data.obj);
      if(res.data.data.obj !== null){
        if(res.data.data.ind >= 0)
          this.colecList[res.data.data.ind] = res.data.data.obj;
        else
          this.colecList.push(res.data.data.obj);
      }

    });

    return await modal.present();
  }

  activeDetails(ind){
    document.getElementsByClassName('colecItem')[ind].classList.add('opened');
  }

  unactiveDetails(ind){
    document.getElementsByClassName('colecItem')[ind].classList.remove('opened');
  }

  deleteCol(ind){
    this.colecList.splice(ind, 1);
  }

  duplicateCol(ind){
    this.colecList.splice(ind, 0, this.colecList[ind]);
  }

  popoverOpen(selec){
    if(selec)
      document.getElementsByClassName('colecItem')[this.clickedCol].classList.add('clicked');
    else
      document.getElementsByClassName('colecItem')[this.clickedCol].classList.remove('clicked');
  }
}
