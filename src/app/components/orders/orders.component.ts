import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { DarkModeService } from '../../services/dark-mode.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
  orders: any[] = [];
  selectedOrder: any = null;
  showDeleteModal = false;
  orderToDelete: any = null;

   constructor(
     private darkModeService: DarkModeService,
     private currencyService: CurrencyService
   ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
  }

  viewOrder(order: any) {
    this.selectedOrder = order;
  }

  closeOrder() {
    this.selectedOrder = null;
  }

  getPrice(amount: number) {
    return this.currencyService.format(amount);
  }

  openDeleteModal(order: any) {
    this.orderToDelete = order;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.orderToDelete = null;
  }

  confirmDeleteOrder() {
    if (this.orderToDelete) {
      this.orders = this.orders.filter(o => o.id !== this.orderToDelete.id);
      localStorage.setItem('orders', JSON.stringify(this.orders));

      if (this.selectedOrder && this.selectedOrder.id === this.orderToDelete.id) {
        this.closeOrder();
      }

      this.closeDeleteModal();
    }
  }

}
