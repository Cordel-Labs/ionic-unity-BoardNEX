import { Component, ViewChildren  } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { ColectionEditPage } from '../colection-edit/colection-edit.page';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire';
import { Colection, Question } from '../class/colection';
import { Router } from '@angular/router';
import { UnityComponentComponent } from '../unity-component/unity-component.component';

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
  favText = 'Favoritar';
  userId: string;
  count = 0;

  backupList: Colection[] = [];
  backupFC = 0;
  searching = false;

  clickedCol: number;
  clickedElement = null;

  constructor(
    private modalController: ModalController,
    public alertController: AlertController,
    private fbApp: FirebaseApp,
    private auth: AngularFireAuth,
    public router: Router
    ) {}

  ngOnInit() {
    this.auth.currentUser.then(res => {
      if(res !== null){
        this.userId = res.uid;
        this.retrieveCollections();
      }
      else
        this.router.navigate(['/login'], {replaceUrl: true});
    });
  }

  retrieveCollections(){
    this.fbApp.database().ref(this.userId + '/collections').once('value').then((snapshot) => {
      snapshot.forEach(e => {
        this.colecList.push(e.val());
        if(e.val().favourited){
          this.favouriteCol(this.count);
        }
        this.count++
      });
    });
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
      if(res.data.data.obj !== null){
        if(res.data.data.ind >= 0)
          this.colecList[res.data.data.ind] = res.data.data.obj;
        else
          this.colecList.push(res.data.data.obj);
        this.fbApp.database().ref(this.userId + '/collections/' + res.data.data.obj.fbKey).set(res.data.data.obj);
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
      this.fbApp.database().ref(this.userId + '/collections/' + this.colecList[ind].fbKey).remove();
      this.colecList.splice(ind, 1);
    }
  }

  duplicateCol(ind){
    const clone = new Colection(this.colecList[ind], this.colecList[ind].createdDate, this.colecList[ind].questoes);
    this.fbApp.database().ref(this.userId + '/collections/' + clone.fbKey).push(clone);
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
    this.fbApp.database().ref(this.userId + '/collections/' + this.colecList[ind].fbKey + '/favourited').push(this.colecList[ind].favourited);
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

  popoverText(ind){
    if(this.colecList[ind].favourited)
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
