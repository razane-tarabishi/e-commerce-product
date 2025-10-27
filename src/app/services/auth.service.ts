import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;
  
  // BehaviorSubject لتتبع المستخدم الحالي مباشرة
  private userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  user$ = this.userSubject.asObservable();

  constructor() {
    this.loggedIn = !!localStorage.getItem('user');


        // إذا ما في مستخدمين بالـ localStorage نضيف admin افتراضي
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.find((u: any) => u.email === 'admin@admin.com')) {
      users.push({ username: 'admin', email: 'admin@admin.com', password: 'admin', role: 'admin' });
      localStorage.setItem('users', JSON.stringify(users));
    }

  }

  register(username: string, email: string, password: string): string {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(email)) {
        return 'Invalid email format';
        }
        
    // check if username OR email exists
    const exists = users.find((u: any) => u.username === username || u.email === email);
    if (exists) {
      return 'User with this username or email already exists';
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return 'success';
  }

  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.loggedIn = true;
      this.userSubject.next(user);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('user');
    this.loggedIn = false;
    this.userSubject.next(null);
  }

  //isLoggedIn(): boolean {
  //  return this.loggedIn;
  //}

  isLoggedIn(): boolean {
  return !!localStorage.getItem('user');
}

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

}
