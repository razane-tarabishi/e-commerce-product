import { Component, OnInit ,ViewChild } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  showLoginModal: boolean = false;

  @ViewChild('toast') toast!: ToastComponent;
  constructor(private currencyService: CurrencyService, private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('selectedProduct');
    if (saved) {
      this.product = JSON.parse(saved);
    } else {
      this.router.navigate(['/']);
    }
  }



  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.role === 'admin';
  }

  getPrice(amount: number): string {
    return this.currencyService.format(amount);
  }

  goBack() {
  this.router.navigate(['/']);
}

 addToCart(card: any) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find((item: any) => item.title === card.title);

  const quantityToAdd = card.selectedQuantity || 1;

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + quantityToAdd;
  } else {
    cart.push({ ...card, quantity: quantityToAdd });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  this.toast.showToast('Product added card successfully!', 'success');
}
}