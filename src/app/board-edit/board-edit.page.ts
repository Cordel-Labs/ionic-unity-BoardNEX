import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseApp } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
import { Board } from '../class/board';

@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.page.html',
  styleUrls: ['./board-edit.page.scss'],
})
export class BoardEditPage implements OnInit {
  newBoard: Board = null;
  colecInd = -1;
  currentSlide;
  currentTab = 0;
  SliderOptions = {
    initialSlide: 0,
    sliderPerView: 1,
    speed: 700,
  };
  public forms: FormGroup;

  constructor(
    private modalController: ModalController,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private fbApp: FirebaseApp,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    if(this.newBoard !== null) {
      this.forms = this.formBuilder.group({
        titulo: [this.newBoard.titulo, [Validators.required]],
        disciplina: [this.newBoard.disciplina, [Validators.required]],
        curso: [this.newBoard.curso, [Validators.required]],
        tema: [this.newBoard.tema, [Validators.required]],
        etapa: [this.newBoard.etapa, [Validators.required]],
        topico: [this.newBoard.topico, [Validators.required]],
      });
      document.getElementById('edit1').children.item(0).innerHTML = 'Editar Tabuleiro';
    }
    else {
      this.forms = this.formBuilder.group({
        titulo: ['', [Validators.required]],
        disciplina: ['', [Validators.required]],
        curso: ['', [Validators.required]],
        tema: ['', [Validators.required]],
        etapa: ['', [Validators.required]],
        topico: ['', [Validators.required]],
      });
    }

    window.addEventListener('message', (e) => {
      console.log(e);
      if(e.data == "started")
        this.unityStartUp();
      else if(e.data == "leaveEditor"){
        this.newBoard = null;
        this.dismiss();
      }
      else if(e.data.ToString().includes('board')){
        this.finishForms(e.data.substring(5));
      }
    });
    // window.postMessage('aaaaa');
  }

  unityStartUp(){
    if(this.newBoard !== null){
      window.unityInstance.SendMessage("BoardManager", "CallbackFunc", this.newBoard.boardString);
    }
  }

  finishForms(boardString){
    let createDate;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let todayDate = `${dd}/${mm}/${today.getFullYear()} ${String(today.getHours())}:${String(today.getMinutes())}`;

    if(this.newBoard !== null)
      this.newBoard.editColection(this.forms.value, todayDate, boardString);
    else
      this.newBoard = new Board(this.forms.value, todayDate, boardString);

    this.dismiss();
  }

  async slidesLoaded(slides) {
    this.currentSlide = slides;
    this.currentTab = await this.currentSlide.getActiveIndex();
    slides.lockSwipes(true);
  }

  navigateTab(dir){
    this.currentSlide.lockSwipes(false);
    this.currentSlide.slideTo(this.currentTab+dir);
    this.currentSlide.lockSwipes(true);
  }

  async cancelEdit(){
    const alert = await this.alertController.create({
      cssClass: 'dismissPopUp',
      header: 'Descartar edição de coleção',
      message: 'Você tem certeza que deseja descartar suas alterações nesta coleção? As alterações serão perdidas e não poderão ser resgatadas.',
      backdropDismiss: false,
      buttons: [{text: 'Cancelar', role: 'dismiss'}, 'Descartar']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if(role !== 'dismiss')
      this.dismiss();
  }

  dismiss() {
    this.modalController.dismiss({
      data: {
        obj: this.newBoard,
        ind: this.colecInd
      },
      'dismissed': true
    });
  }
}
