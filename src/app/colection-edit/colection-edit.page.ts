import { Component, OnInit } from '@angular/core';

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
    speed: 200,
  };

  constructor() { }

  ngOnInit() {
  }

  async slidesLoaded(slides) {
    this.currentSlide = slides;
    this.currentTab = await this.currentSlide.getActiveIndex();
    // this.tabBarButtons[this.currentTab].setAttribute('disabled', 'true');
    slides.lockSwipes(true);
  }

  navigateTab(dir){

  }

}
