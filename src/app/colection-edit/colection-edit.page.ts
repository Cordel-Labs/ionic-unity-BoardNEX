import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseApp } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
import { Colection, Question } from '../class/colection';

@Component({
  selector: 'app-colection-edit',
  templateUrl: './colection-edit.page.html',
  styleUrls: ['./colection-edit.page.scss'],
})
export class ColectionEditPage implements OnInit {
  newColection: Colection = null;
  colecInd = -1;
  questions: Question[] = [];
  qInd = 0;
  rightAnswer = 0;
  qImg = '';
  altToggles;
  currentSlide;
  currentTab = 0;
  footMenuIsOpen = false;
  footMenuButton = 'chevron-up-outline';
  SliderOptions = {
    initialSlide: 0,
    sliderPerView: 1,
    speed: 700,
  };
  public forms: FormGroup;
  public questionForm: FormGroup;

  constructor(
    private modalController: ModalController,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private fbApp: FirebaseApp,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.altToggles = document.getElementsByClassName('altToggle');
    document
      .getElementById('galleryInput')
      .addEventListener('change', () =>
        this.onImageSelected(
          <HTMLInputElement>document.getElementById('galleryInput')
        )
      );
    if(this.newColection !== null) {
      this.forms = this.formBuilder.group({
        titulo: [this.newColection.titulo, [Validators.required]],
        disciplina: [this.newColection.disciplina, [Validators.required]],
        curso: [this.newColection.curso, [Validators.required]],
        tema: [this.newColection.tema, [Validators.required]],
        etapa: [this.newColection.etapa, [Validators.required]],
        topico: [this.newColection.topico, [Validators.required]],
      });
      this.questions = this.newColection.questoes;
      this.questionForm = this.formBuilder.group({
        enum: [this.questions[0].enunciado, [Validators.required]],
        alter1: [this.questions[0].alter[0]], alter2: [this.questions[0].alter[1]], alter3: [this.questions[0].alter[2]], alter4: [this.questions[0].alter[3]]
      });
      this.rightAnswer = this.questions[0].rightAnswer;
      this.altToggles[0].checked = false;
      this.altToggles[this.rightAnswer].checked = true;

      document.getElementById('edit1').children.item(0).innerHTML = 'Editar Coleção';
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
      this.questionForm = this.formBuilder.group({
        enum: ['', [Validators.required]], alter1: [''], alter2: [''], alter3: [''], alter4: ['']
      });
      this.questions.push(new Question('', ['','','',''], 0), new Question('', ['','','',''], 0), new Question('', ['','','',''], 0), new Question('', ['','','',''], 0));
    }
  }

  finishForms(){
    let createDate;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let todayDate = `${dd}/${mm}/${today.getFullYear()} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    this.questions[this.qInd].enunciado = this.questionForm.get('enum').value;
    this.questions[this.qInd].alter = [this.questionForm.get('alter1').value, this.questionForm.get('alter2').value, this.questionForm.get('alter3').value, this.questionForm.get('alter4').value];
    this.questions[this.qInd].rightAnswer = this.rightAnswer;
    if(this.qImg !== ''){
      this.questions[this.qInd].image = this.qImg;
    }

    if(this.newColection !== null)
      this.editColection(this.forms.value, todayDate, this.questions);
    else
      this.newColection = new Colection(this.forms.value, todayDate, this.questions);

    // this.fbApp.database().ref('nome').set(this.newColection);
    this.dismiss();
  }

  editColection(forms, editedDate, questoes){
    this.newColection.titulo = forms.titulo;
    this.newColection.disciplina = forms.disciplina;
    this.newColection.curso = forms.curso;
    this.newColection.tema = forms.tema;
    this.newColection.etapa = forms.etapa;
    this.newColection.topico = forms.topico;
    this.newColection.lastMod = editedDate;
    this.newColection.questoes = questoes;
  }

  openFootMenu(){
    const footMenu = document.getElementById('footMenu');
    footMenu.style.bottom = (this.footMenuIsOpen) ? 'calc(-30vh + 40px)' : '0px';
    this.footMenuIsOpen = !this.footMenuIsOpen;
    this.footMenuButton = (this.footMenuIsOpen) ? 'chevron-down-outline' : 'chevron-up-outline';
  }

  async slidesLoaded(slides) {
    this.currentSlide = slides;
    this.currentTab = await this.currentSlide.getActiveIndex();
    // this.tabBarButtons[this.currentTab].setAttribute('disabled', 'true');
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
        obj: this.newColection,
        ind: this.colecInd
      },
      'dismissed': true
    });
  }

  getImage(){
    document.getElementById('galleryInput').click();
  }

  onImageSelected(event) {
    const selectedImage = event.files[0];
    console.log(event.files[0]);
    // this.qImg = `user/${this.qInd}`;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.qImg = e.target.result;
    };
    reader.readAsDataURL(selectedImage);

    // let storageTask = this.storage.upload(
    //   this.qImg,
    //   selectedImage
    // );
  }

  changeRightAnswer(e, ind){
    this.altToggles[this.rightAnswer].checked = false;
    this.rightAnswer = ind;
  }

  switchQuestion(ind){
    this.questions[this.qInd].enunciado = this.questionForm.get('enum').value;
    this.questions[this.qInd].alter = [this.questionForm.get('alter1').value, this.questionForm.get('alter2').value, this.questionForm.get('alter3').value, this.questionForm.get('alter4').value];
    this.questions[this.qInd].rightAnswer = this.rightAnswer;
    if(this.qImg !== ''){
      this.questions[this.qInd].image = this.qImg;
    }
    this.questionForm = this.formBuilder.group({
      enum: [this.questions[ind].enunciado, [Validators.required]],
      alter1: [this.questions[ind].alter[0]],
      alter2: [this.questions[ind].alter[1]],
      alter3: [this.questions[ind].alter[2]],
      alter4: [this.questions[ind].alter[3]]
    });
    this.qImg = this.questions[ind].image;
    this.changeRightAnswer(undefined, this.rightAnswer);
    this.rightAnswer = this.questions[ind].rightAnswer;
    this.altToggles[this.rightAnswer].checked = true;
    this.qInd = ind;
  }
}
