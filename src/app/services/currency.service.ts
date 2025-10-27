import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currencySubject = new BehaviorSubject<string>('USD'); // العملة الافتراضية
  currency$ = this.currencySubject.asObservable();

  private rates: { [key: string]: number } = {
    USD: 1,
    EUR: 0.93,
    LBP: 4500
  };

  setCurrency(curr: string) {
    if (this.rates[curr]) {
      this.currencySubject.next(curr);
    }
  }

  getCurrency(): string {
    return this.currencySubject.getValue();
  }

  convert(amount: number): number {
    return amount * this.rates[this.getCurrency()];
  }

  format(amount: number): string {
    const symbol = this.getCurrency() === 'USD' ? '$' :
                   this.getCurrency() === 'EUR' ? '€' : 'L L';
    return `${symbol} ${this.convert(amount).toFixed(2)}`;
  }
}
