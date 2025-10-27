import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { DarkModeService } from '../../services/dark-mode.service';
@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit{
  
  @ViewChild('toast') toast!: ToastComponent;
  title = '';
  description = '';
  price: number | null = null;
  imageData: string | null = null;
  darkMode = false;
  constructor(private router: Router,private darkModeService: DarkModeService) {}

  ngOnInit(): void {
      this.darkModeService.darkMode$.subscribe(value => {
      this.darkMode = value;
    });
  }
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageData = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const newCard = {
      id: Date.now(),
      title: this.title,
      description: this.description,
      price: this.price,
      image: this.imageData,
      liked:false
    };

  const cards = JSON.parse(localStorage.getItem('cards') || '[]');

    cards.unshift(newCard);
    localStorage.setItem('cards', JSON.stringify(cards));

   
    this.toast.showToast('Card added successfully!', 'success');


    this.title = '';
    this.description = '';
    this.price = null;
    this.imageData = null;

  }
}
