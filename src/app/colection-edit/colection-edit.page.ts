import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-colection-edit',
  templateUrl: './colection-edit.page.html',
  styleUrls: ['./colection-edit.page.scss'],
})
export class ColectionEditPage implements OnInit {
  currentSlide;
  currentTab = 0;
  SliderOptions = {
    initialSlide: 0,
    sliderPerView: 1,
    speed: 700,
  };

  constructor(private modalController: ModalController) { }

  ngOnInit() {
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
      'dismissed': true
    });
  }

}
