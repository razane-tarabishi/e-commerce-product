import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode.service';
import { CurrencyService } from '../../services/currency.service';
@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrl: './like.component.scss'
})
export class LikeComponent implements OnInit{
   
  likedCards: any[] = [];
  darkMode = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  
  selectedCurrency = 'USD';

  isDescriptionExpanded: boolean[] = [];
  
  constructor(
    private darkModeService: DarkModeService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.loadLikedCards();

      this.darkModeService.darkMode$.subscribe(value => {
      this.darkMode = value;
    });
    this.currencyService.currency$.subscribe(curr => this.selectedCurrency = curr);

  }

  loadLikedCards() {
    this.likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');
  }

//  removeLike(card: any) {
//    let likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');
//    likedCards = likedCards.filter((item: any) => item.title !== card.title);

//    localStorage.setItem('likedCards', JSON.stringify(likedCards));

//    this.loadLikedCards();
//  }
//}

 removeLike(card: any) {
  let likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');
  likedCards = likedCards.filter((item: any) => item.title !== card.title);
  localStorage.setItem('likedCards', JSON.stringify(likedCards));

  let cards = JSON.parse(localStorage.getItem('cards') || '[]');
  cards = cards.map((item: any) =>
    item.title === card.title ? { ...item, liked: false } : item
  );
  localStorage.setItem('cards', JSON.stringify(cards));

  this.loadLikedCards();
}
 


get paginatedLikedCards() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.likedCards.slice(start, end);
}

get totalPages() {
  return Math.ceil(this.likedCards.length / this.itemsPerPage);
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}
 

  getPrice(amount: number) {
    return this.currencyService.format(amount);
  }
  
  toggleDescription(index: number) {
  this.isDescriptionExpanded[index] = !this.isDescriptionExpanded[index];
}

}
