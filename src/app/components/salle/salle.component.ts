import { Component, OnInit, ViewChild } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode.service';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { CurrencyService } from '../../services/currency.service';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

@Component({
  selector: 'app-salle',
  templateUrl: './salle.component.html',
  styleUrls: ['./salle.component.scss']
})
export class SalleComponent implements OnInit{
  cart: any[] = [];
  showModal: boolean = false;
  deleteIndex: number | null = null;
  darkMode = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  showCheckoutModal = false;

  @ViewChild('toast') toast!: ToastComponent;

  selectedCurrency = 'USD';

  // Checkout Data
  checkoutData = {
    name: '',
    phone: '',
    address: '',
    country: '' // default country
  };

countries = [
  { name: 'Lebanon', code: '+961', isoCode: 'LB' },
  { name: 'USA', code: '+1', isoCode: 'US' },
  { name: 'France', code: '+33', isoCode: 'FR' }
];


  constructor(
    private router: Router,
    private darkModeService: DarkModeService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.loadCart();

    this.darkModeService.darkMode$.subscribe(value => {
      this.darkMode = value;
    });

    this.currencyService.currency$.subscribe(curr => this.selectedCurrency = curr);
  }


  selectedCountry: any = null;

onCountryChange() {
  this.checkoutData.phone = ''; // reset phone when changing country
  this.selectedCountry = this.countries.find(c => c.name === this.checkoutData.country);
}

  loadCart() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]').map((item: any) => {
      return { ...item, quantity: item.quantity || 1 };
    });
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getPrice(amount: number) {
    return this.currencyService.format(amount);
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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
      const deletedItem = this.cart[this.deleteIndex];

      this.cart.splice(this.deleteIndex, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));

      // Update cards if needed
      let cards = JSON.parse(localStorage.getItem('cards') || '[]');
      cards = cards.map((item: any) =>
        item.title === deletedItem.title ? { ...item, selectedQuantity: 1 } : item
      );
      localStorage.setItem('cards', JSON.stringify(cards));

      this.toast.showToast('Product deleted!', 'error');
    }
    this.closeModal();
  }

  increaseQuantity(index: number) {
    if (index >= 0 && index < this.cart.length) {
      this.cart[index].quantity = (this.cart[index].quantity || 1) + 1;
      this.updateCart();
    }
  }

  decreaseQuantity(index: number) {
    if (index >= 0 && index < this.cart.length) {
      const currentQuantity = this.cart[index].quantity || 1;
      if (currentQuantity > 1) {
        this.cart[index].quantity = currentQuantity - 1;
        this.updateCart();
      } else {
        this.openDeleteModal(index);
      }
    }
  }

  private updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  get paginatedCart() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.cart.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.cart.length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  proceedToCheckout() {
    this.showCheckoutModal = true;
  }

  closeCheckoutModal() {
    this.showCheckoutModal = false;
    this.checkoutData = { name: '', phone: '', address: '', country: 'Lebanon' };
  }

  // Full phone with country code
  //get fullPhone() {
  //  const country = this.countries.find(c => c.name === this.checkoutData.country);
  //  return country ? `${country.code}${this.checkoutData.phone}` : this.checkoutData.phone;
  //}
// Full phone with country code in E164 format
get fullPhone() {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const country = this.countries.find(c => c.name === this.checkoutData.country);
  if (!country) return this.checkoutData.phone;

  try {
    const number = phoneUtil.parseAndKeepRawInput(this.checkoutData.phone, country.isoCode);
    return phoneUtil.format(number, PhoneNumberFormat.E164);
  } catch (e) {
    return this.checkoutData.phone;
  }
}

  // Validate phone number based on country
  //isPhoneValid() {
  //  const country = this.countries.find(c => c.name === this.checkoutData.country);
  //  if (!country) return false;
   // const length = this.checkoutData.phone.replace(/\D/g, '').length;
  //  return length >= country.minLength && length <= country.maxLength;
  //}

// Validate phone number
isPhoneValid() {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const country = this.countries.find(c => c.name === this.checkoutData.country);
  if (!country) return false;

  try {
    const number = phoneUtil.parseAndKeepRawInput(this.checkoutData.phone, country.isoCode);
    return phoneUtil.isValidNumberForRegion(number, country.isoCode);
  } catch (e) {
    return false;
  }
}

  // Confirm checkout
  confirmCheckout(form: any) {
    if (!this.isPhoneValid()) {
      this.toast.showToast('Invalid phone number!', 'error');
      return;
    }
    if (!this.checkoutData.name || !this.checkoutData.address || !this.checkoutData.country) {
      this.toast.showToast('Please fill all required fields!', 'error');
    }
    if (form.valid) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');

      const newOrder = {
        id: Date.now(),
        items: this.cart,
        total: this.getTotal(),
        date: new Date().toLocaleString(),
        status: 'pending',
        userInfo: { ...this.checkoutData, phone: this.fullPhone }
      };

      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      this.cart = [];
      localStorage.removeItem('cart');

      this.toast.showToast('Order placed successfully!', 'success');
      this.closeCheckoutModal();
    }
  }

} 




