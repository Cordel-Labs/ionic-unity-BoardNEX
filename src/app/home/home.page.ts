import { Component, ViewChildren  } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { ColectionEditPage } from '../colection-edit/colection-edit.page';
import { FirebaseApp } from '@angular/fire';
import { Colection, Question } from '../class/colection';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  colectionEdit = ColectionEditPage;
  colecList: Colection[] = [];
  favouriteList: Colection[] = [];
  favouritedCount = 0;
  searchText = '';

  backupList: Colection[] = [];
  backupFC = 0;
  searching = false;

  clickedCol: number;
  clickedElement = null;

  constructor(
    private modalController: ModalController,
    public alertController: AlertController,
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
    this.clickedElement.classList.add('opened');
    // document.getElementsByClassName('colecItem')[ind].classList.add('opened');
  }

  unactiveDetails(ind){
    this.clickedElement.classList.remove('opened');
    this.clickedElement = null;
    // document.getElementsByClassName('colecItem')[ind].classList.remove('opened');
  }

  async deleteCol(ind){
    const alert = await this.alertController.create({
      cssClass: 'dismissPopUp',
      header: 'Excluir coleção',
      message: 'Você tem certeza que deseja excluir esta coleção? As alterações serão perdidas e não poderão ser resgatadas.',
      backdropDismiss: false,
      buttons: [{text: 'Cancelar', role: 'dismiss'}, 'Excluir']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if(role !== 'dismiss'){
      if(this.colecList[ind].favourited)
        if(this.searching)
          this.backupFC--;
        else
          this.favouritedCount--;
      this.colecList.splice(ind, 1);
    }
  }

  duplicateCol(ind){
    const clone = new Colection(this.colecList[ind], this.colecList[ind].createdDate, this.colecList[ind].questoes)
    this.colecList.splice(ind, 0, clone);
  }

  favouriteCol(ind){
    if(this.favouriteList.includes(this.colecList[ind])){
      this.favouriteList.splice(this.favouriteList.indexOf(this.colecList[ind]), 1);
      this.colecList[ind].favourited = false;
      if(this.searching)
        this.backupFC--;
      else
        this.favouritedCount--;
    }
    else{
      this.favouriteList.push(this.colecList[ind]);
      this.colecList[ind].favourited = true;
      if(this.searching)
        this.backupFC++;
      else
        this.favouritedCount++;
    }
  }

  focusSearch(){
    if(this.searchText === '' && !this.searching){
      console.log(this.colecList);
      this.backupList = this.backupList.concat(this.colecList);
      console.log(this.backupList);
      this.backupFC = this.favouritedCount;
      this.favouritedCount = 0;
      this.searching = true;
    }
    else if(this.searchText === '' && this.searching){
      this.colecList = [];
      this.colecList = this.colecList.concat(this.backupList);
      this.backupList = [];
      this.favouritedCount = this.backupFC;
      this.backupFC = 0;
      this.searching = false;
    }
  }

  searchColection(){
    const filterText = this.searchText;
    this.colecList = this.backupList.filter((val) => {
      return val.titulo.includes(filterText);
    });
  }

  popoverOpen(event){
    if(event !== undefined){
      this.clickedElement = event.srcElement.parentElement.parentElement.parentElement;
      this.clickedElement.classList.add('clicked');
    }
    else{
      this.clickedElement.classList.remove('clicked');
    }
  }
}
