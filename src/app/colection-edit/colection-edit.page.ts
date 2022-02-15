import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseApp } from '@angular/fire';
import { Colection } from '../class/colection';
// import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-colection-edit',
  templateUrl: './colection-edit.page.html',
  styleUrls: ['./colection-edit.page.scss'],
})
export class ColectionEditPage implements OnInit {
  newColection: Colection = null;
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
    private formBuilder: FormBuilder,
    private fbApp: FirebaseApp
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
  }

  finishForms(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let todayDate = dd + '/' + mm + '/' + yyyy;

    this.newColection = new Colection(this.forms.value, todayDate);
    // console.log(this.newColection);
    // this.fbApp.database().ref('nome').set(this.newColection);
    this.dismiss();
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

}
