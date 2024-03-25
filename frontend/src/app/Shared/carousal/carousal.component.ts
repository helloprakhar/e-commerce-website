import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-carousal',
  templateUrl: './carousal.component.html',
  styleUrls: ['./carousal.component.css'],
})
export class CarousalComponent implements OnInit, OnDestroy {
  images = [
    'assets/images/banner.jpg',
    'assets/images/banner1.jpg',
    'assets/images/banner3.jpg',
  ];
  currentImageIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startAutoRotation();
  }

  ngOnDestroy(): void {
    this.stopAutoRotation();
  }

  startAutoRotation(): void {
    this.intervalId = setInterval(() => {
      this.showNextImage();
    }, 3000);
  }

  stopAutoRotation(): void {
    clearInterval(this.intervalId);
  }

  showNextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  showPrevImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }
}
