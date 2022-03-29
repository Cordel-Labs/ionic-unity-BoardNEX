import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
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
  boards: Colection[] = [/*'','','',''*/]; // change to boards
  favouriteList: Colection[] = [];
  favouritedCount = 0;
  searchText = '';
  favText = 'Favoritar';

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
      colec = this.boards[ind];
    const modal = await this.modalController.create({
      component: this.colectionEdit,
      cssClass: 'colectionEditPageClass',
      componentProps: {
        newColection: colec,
        colecInd: ind
      }
    });

    modal.onDidDismiss().then((res) => {
      if(res.data.data.obj !== null){
        if(res.data.data.ind >= 0)
          this.boards[res.data.data.ind] = res.data.data.obj;
        else
          this.boards.push(res.data.data.obj);
      }
    });

    return await modal.present();
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
      if(this.boards[ind].favourited)
        if(this.searching)
          this.backupFC--;
        else
          this.favouritedCount--;
      this.boards.splice(ind, 1);
    }
  }

  activeDetails(ind){
  }

  unactiveDetails(ind){
  }

  duplicateCol(ind){
    const clone = new Colection(this.boards[ind], this.boards[ind].createdDate, this.boards[ind].questoes)
    this.boards.splice(ind, 0, clone);
  }

  favouriteCol(ind){
    if(this.favouriteList.includes(this.boards[ind])){
      this.favouriteList.splice(this.favouriteList.indexOf(this.boards[ind]), 1);
      this.boards[ind].favourited = false;
      if(this.searching)
        this.backupFC--;
      else
        this.favouritedCount--;
    }
    else{
      this.favouriteList.push(this.boards[ind]);
      this.boards[ind].favourited = true;
      if(this.searching)
        this.backupFC++;
      else
        this.favouritedCount++;
    }
  }

  focusSearch(){
    if(this.searchText === '' && !this.searching){
      console.log(this.boards);
      this.backupList = this.backupList.concat(this.boards);
      console.log(this.backupList);
      this.backupFC = this.favouritedCount;
      this.favouritedCount = 0;
      this.searching = true;
    }
    else if(this.searchText === '' && this.searching){
      this.boards = [];
      this.boards = this.boards.concat(this.backupList);
      this.backupList = [];
      this.favouritedCount = this.backupFC;
      this.backupFC = 0;
      this.searching = false;
    }
  }

  searchColection(){
    const filterText = this.searchText;
    this.boards = this.backupList.filter((val) => {
      return val.titulo.includes(filterText);
    });
  }

  popoverText(ind){
    if(this.boards[ind].favourited)
      this.favText = "Desfavoritar";
    else
      this.favText = "Favoritar";
  }

  popoverOpen(event, pop = null){
    if(event !== undefined){
      this.clickedElement = event.srcElement.parentElement.parentElement.parentElement;
      this.clickedElement.classList.add('clicked');
      if(event.clientY >= 450){
        pop.present({clientX : event.clientX, clientY: event.clientY - 205});
      }
      else {
        pop.present(event);
      }
    }
    else{
      this.clickedElement.classList.remove('clicked');
    }
  }
}
