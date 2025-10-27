import { Component, ViewChild } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
@Component({
  selector: 'app-add-carousel',
  templateUrl: './add-carousel.component.html',
  styleUrl: './add-carousel.component.scss',
})
export class AddCarouselComponent {
  images: string[] = JSON.parse(localStorage.getItem('carouselImages') || '[]');
  selectedImage: string | null = null;

  @ViewChild('toast') toast!: ToastComponent;

  // Modal State
  isModalOpen = false;
  modalImage: string | null = null;
  modalIndex: number | null = null;

  // Zoom & Drag
  zoom: number = 1;
  imagePosition = { x: 0, y: 0 };
  dragging = false;
  dragStart = { x: 0, y: 0 };

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addImage() {
    if (this.selectedImage) {
      this.images.push(this.selectedImage);
      localStorage.setItem('carouselImages', JSON.stringify(this.images));
      this.toast.showToast('Carousel Added successfully!', 'success');
      this.selectedImage = null;

      const event = new Event('storage');
      window.dispatchEvent(event);
    }
  }

   isDeleteModalOpen = false;

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  cancelDelete() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    if (this.modalIndex !== null) {
      this.images.splice(this.modalIndex, 1);
      localStorage.setItem('carouselImages', JSON.stringify(this.images));
      this.toast.showToast('Image deleted!', 'error');
      this.closeModal();
      window.dispatchEvent(new Event('storage'));
    }
    this.isDeleteModalOpen = false;
  }
  
  // ==== Modal Logic ====
  openModal(img: string, index: number) {
    this.modalImage = img;
    this.modalIndex = index;
    this.isModalOpen = true;
    this.resetZoom();
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalImage = null;
    this.modalIndex = null;
  }

  deleteImage() {
    if (this.modalIndex !== null) {
      this.images.splice(this.modalIndex, 1);
      localStorage.setItem('carouselImages', JSON.stringify(this.images));
      this.toast.showToast('Image deleted!', 'error');
      this.closeModal();
    }
  }

triggerUpload() {
  document.getElementById('replaceInput')?.click();
}
replaceImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && this.modalIndex !== null) {
    const reader = new FileReader();
    reader.onload = () => {
      this.images[this.modalIndex!] = reader.result as string;
      localStorage.setItem('carouselImages', JSON.stringify(this.images));
      this.toast.showToast('Image replaced!', 'info');
      this.modalImage = this.images[this.modalIndex!]; // تحدّث المعاينة
    };
    reader.readAsDataURL(file);
  }
}


  // ==== Zoom & Drag ====
  zoomIn() {
    if (this.zoom < 3) this.zoom = Math.min(3, this.zoom + 0.25);
  }

  zoomOut() {
    if (this.zoom > 0.5) {
      this.zoom = Math.max(0.5, this.zoom - 0.25);
      if (this.zoom === 1) this.imagePosition = { x: 0, y: 0 };
    }
  }

  resetZoom() {
    this.zoom = 1;
    this.imagePosition = { x: 0, y: 0 };
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    event.deltaY < 0 ? this.zoomIn() : this.zoomOut();
  }

  startDrag(event: MouseEvent) {
    this.dragging = true;
    this.dragStart = { x: event.clientX - this.imagePosition.x, y: event.clientY - this.imagePosition.y };
  }

  drag(event: MouseEvent) {
    if (this.dragging) {
      this.imagePosition = {
        x: event.clientX - this.dragStart.x,
        y: event.clientY - this.dragStart.y,
      };
    }
  }

  stopDrag() {
    this.dragging = false;
  }

  getImageTransform() {
    return `translate(${this.imagePosition.x}px, ${this.imagePosition.y}px) scale(${this.zoom})`;
  }
}

