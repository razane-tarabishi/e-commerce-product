import { Component, OnInit,  ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { DarkModeService } from '../../services/dark-mode.service';
import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
   styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedCurrency = 'USD';

  constructor(
    private router: Router,
    private darkModeService: DarkModeService,
    public auth: AuthService,
    private currencyService: CurrencyService
  ) {}

  @ViewChild('toast') toast!: ToastComponent;

  cards: any[] = [];
  showLoginModal: boolean = false;
  darkMode = false;

  // for edit
  showEditModal: boolean = false;
  editCard: any = {};
  editIndex: number | null = null;

  showModal: boolean = false;
  deleteIndex: number | null = null;
  
 currentPage: number = 1;  
 itemsPerPage: number = 4;  

selectedFilter: string = 'all';
filteredCards: any[] = [];

isDescriptionExpanded: boolean[] = [];

  ngOnInit() {
  const savedCurrency = localStorage.getItem('selectedCurrency');
      if (savedCurrency) {
        this.selectedCurrency = savedCurrency;
        this.currencyService.setCurrency(savedCurrency);
       }

    this.loadCards();

    this.darkModeService.darkMode$.subscribe(value => {
    this.darkMode = value;
    });
    this.currencyService.currency$.subscribe(curr => this.selectedCurrency = curr);
  }

  changeCurrency() {
    this.currencyService.setCurrency(this.selectedCurrency);
    localStorage.setItem('selectedCurrency', this.selectedCurrency);
  }

  getPrice(amount: number): string {
    return this.currencyService.format(amount);
  }


  loadCards() {
      this.cards = JSON.parse(localStorage.getItem('cards') || '[]');
      this.applyFilter();
  }  
  
    isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); 
  }

//   toggleLike(card: any) {
//       if (!this.isLoggedIn()) {
//       this.showLoginModal = true;
//       return;
//     }
//     card.liked = !card.liked;
//     localStorage.setItem('cards', JSON.stringify(this.cards));


//       //if like true add to likedcards
//   let likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');

//   if (card.liked) {
//     //iza lproduct mech ma3melu like abel zidu 
//     if (!likedCards.find((item: any) => item.title === card.title)) {
//       likedCards.push(card);
//        this.toast.showToast('Product liked successfully!', 'success');
//     }
//   } else {
//     likedCards = likedCards.filter((item: any) => item.title !== card.title);
//     this.toast.showToast('Product unliked!', 'info'); 
//   }

//   localStorage.setItem('likedCards', JSON.stringify(likedCards));
// }

toggleLike(card: any) {
  if (!this.isLoggedIn()) {
    this.showLoginModal = true;
    return;
  }
  card.liked = !card.liked;
  localStorage.setItem('cards', JSON.stringify(this.cards));

  let likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');

  if (card.liked) {
    // Store id, title, price, and description
    if (!likedCards.find((item: any) => item.id === card.id)) {
      likedCards.push({
        id: card.id,
        title: card.title,
        price: card.price,
        description: card.description
      });
      this.toast.showToast('Product liked successfully!', 'success');
    }
  } else {
    likedCards = likedCards.filter((item: any) => item.id !== card.id);
    this.toast.showToast('Product unliked!', 'info');
  }

  localStorage.setItem('likedCards', JSON.stringify(likedCards));
}
  

  addToCart(card: any) {
    if (!this.isLoggedIn()) {
      this.showLoginModal = true;
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.title === card.title);
    
    const quantityToAdd = card.selectedQuantity || 1;

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + quantityToAdd;
  } else {
    cart.push({...card, quantity: quantityToAdd});
  }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    //alert('Product added to cart!');
    //console.log('Cart now:', cart);
    this.toast.showToast('Card added successfully!', 'success');
     card.selectedQuantity = 1;
  }

  goToCart() {
  this.router.navigate(['/salle']);
}


  closeLoginModal() {
    this.showLoginModal = false;
  }

  login() {
    // redirect to login page
    this.router.navigate(['/login']);
  }
  
increaseQuantity(card: any) {
  if (!card.selectedQuantity) card.selectedQuantity = 1;
  card.selectedQuantity++;
}

decreaseQuantity(card: any) {
  if (card.selectedQuantity && card.selectedQuantity > 1) {
    card.selectedQuantity--;
  }
}

  openEditModal(card: any, index: number) {
    this.editCard = { ...card }; // copy
    this.editIndex = index;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editCard = {};
    this.editIndex = null;
  }

    // check if admin
  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.role === 'admin';
  }
  

  openDeleteModal(index: number) {
    this.deleteIndex = index;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.deleteIndex = null;
  }

  confirmDelete() {
  if (this.deleteIndex !== null) {
    const deletedCard = this.cards[this.deleteIndex];

    //delete card
    this.cards.splice(this.deleteIndex, 1);
    localStorage.setItem('cards', JSON.stringify(this.cards));

    //delete like card
    let likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');
    likedCards = likedCards.filter((item: any) => item.title !== deletedCard.title);
    localStorage.setItem('likedCards', JSON.stringify(likedCards));

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter((item: any) => item.title !== deletedCard.title);
    localStorage.setItem('cart', JSON.stringify(cart));

    this.toast.showToast('Product deleted!', 'success');
  }
  this.closeModal();
  this.loadCards();
}

saveEdit() {
  if (this.editIndex !== null) {
    const originalCard = this.cards[this.editIndex];
    const updatedCard = { ...this.editCard };

    
    const noChanges = 
      originalCard.title === updatedCard.title &&
      originalCard.description === updatedCard.description &&
      originalCard.price === updatedCard.price &&
      originalCard.image === updatedCard.image;

    if (noChanges) {
      this.toast.showToast('No changes made!', 'info');
      this.closeEditModal();
      return;
    }


    this.cards[this.editIndex] = updatedCard;
    localStorage.setItem('cards', JSON.stringify(this.cards));

    
    //upload like card
    let likedCards = JSON.parse(localStorage.getItem('likedCards') || '[]');
    likedCards = likedCards.map((item: any) =>
      item.title === updatedCard.title ? { ...updatedCard, liked: true } : item
    );
    localStorage.setItem('likedCards', JSON.stringify(likedCards));
    
    //upload card
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.map((item: any) =>
      item.title === updatedCard.title ? { ...updatedCard, quantity: item.quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(cart));

    this.toast.showToast('Product updated successfully!', 'success');
  }
  this.closeEditModal();
  this.loadCards();
}
 
get paginatedCards() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  //return this.cards.slice(start, end);
  return this.filteredCards.slice(start, end);
}

get totalPages() {
  //return Math.ceil(this.cards.length / this.itemsPerPage);
  return Math.ceil(this.filteredCards.length / this.itemsPerPage) || 1;
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




 applyFilter() {
  if (this.selectedFilter === 'low') {
    this.filteredCards = this.cards.filter(c => c.price <= 50);
  } else if (this.selectedFilter === 'mid') {
    this.filteredCards = this.cards.filter(c => c.price > 50 && c.price <= 100);
  } else if (this.selectedFilter === 'high') {
    this.filteredCards = this.cards.filter(c => c.price > 100);
  } else {
    this.filteredCards = [...this.cards];
  }

  this.currentPage = 1; 
}
  

  openProductDetails(card: any) {
  localStorage.setItem('selectedProduct', JSON.stringify(card));
  this.router.navigate(['/product', card.title]); 
}
 

toggleDescription(index: number) {
  this.isDescriptionExpanded[index] = !this.isDescriptionExpanded[index];
}

}
