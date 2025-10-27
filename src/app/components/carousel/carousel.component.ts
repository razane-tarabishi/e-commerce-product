import { Component, OnInit , OnDestroy} from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit, OnDestroy {
    images: string[] = [];
    activeIndex = 0;
    interval: any;

  ngOnInit() {
  this.images = JSON.parse(localStorage.getItem('carouselImages') || '[]');

    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
}

    ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length;
  }

}