import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseApp } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
import { Colection, Question } from '../class/colection';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
// import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-colection-edit',
  templateUrl: './colection-edit.page.html',
  styleUrls: ['./colection-edit.page.scss'],
})
export class ColectionEditPage implements OnInit {
  newColection: Colection = null;
  questions: Question[] = [];
  qInd = 0;
  rightAnswer = 0;
  previous = 3;
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
    private formBuilder: FormBuilder,
    private fbApp: FirebaseApp,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.forms = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      disciplina: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      tema: ['', [Validators.required]],
      etapa: ['', [Validators.required]],
      topico: ['', [Validators.required]],
    });
    this.questionForm = this.formBuilder.group({
      enum: ['', [Validators.required]],
      alter1: [''],
      alter2: [''],
      alter3: [''],
      alter4: ['']
    });
    this.questions.push(new Question('', ['','','',''], 0), new Question('', ['','','',''], 0), new Question('', ['','','',''], 0), new Question('', ['','','',''], 0));
    this.altToggles = document.getElementsByClassName('altToggle');
    document
      .getElementById('galleryInput')
      .addEventListener('change', () =>
        this.onImageSelected(
          <HTMLInputElement>document.getElementById('galleryInput')
        )
      );
  }

  finishForms(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let todayDate = `${dd}/${mm}/${today.getFullYear()} ${String(today.getHours())}:${String(today.getMinutes())}`;

    this.questions[this.qInd].enunciado = this.questionForm.get('enum').value;
    this.questions[this.qInd].alter = [this.questionForm.get('alter1').value, this.questionForm.get('alter2').value, this.questionForm.get('alter3').value, this.questionForm.get('alter4').value];
    this.questions[this.qInd].rightAnswer = this.rightAnswer;

    this.newColection = new Colection(this.forms.value, todayDate, this.questions);

    // this.fbApp.database().ref('nome').set(this.newColection);
    this.dismiss();
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

  dismiss() {
    this.modalController.dismiss({
      data: this.newColection,
      'dismissed': true
    });
  }

  getImage(){
    document.getElementById('galleryInput').click();
  }

  onImageSelected(event) {
    const selectedImage = event.files[0];
    let storageTask = this.storage.upload(
      'files/imagem(1)',
      selectedImage
    );
  }

  changeRightAnswer(e, ind){
    this.altToggles[this.rightAnswer].checked = false;
    this.rightAnswer = ind;
  }

  switchQuestion(ind){
    this.questions[this.qInd].enunciado = this.questionForm.get('enum').value;
    this.questions[this.qInd].alter = [this.questionForm.get('alter1').value, this.questionForm.get('alter2').value, this.questionForm.get('alter3').value, this.questionForm.get('alter4').value];
    this.questions[this.qInd].rightAnswer = this.rightAnswer;
    this.questionForm = this.formBuilder.group({
      enum: [this.questions[ind].enunciado, [Validators.required]],
      alter1: [this.questions[ind].alter[0]],
      alter2: [this.questions[ind].alter[1]],
      alter3: [this.questions[ind].alter[2]],
      alter4: [this.questions[ind].alter[3]]
    });
    this.changeRightAnswer(undefined, this.rightAnswer);
    this.rightAnswer = this.questions[ind].rightAnswer;
    this.altToggles[this.rightAnswer].checked = true;
    this.qInd = ind;
  }
}
