import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('toast') toast!: ToastComponent;

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoginMode = true;

  constructor(private auth: AuthService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  onSubmit() {
    if (this.isLoginMode) {
      const success = this.auth.login(this.email, this.password);
      if (success) {
        this.toast.showToast('Login successful', 'success');
        this.router.navigate(['/home']);
      } else {
        this.toast.showToast('Invalid email or password', 'error');
      }
    } else {
      if (this.password !== this.confirmPassword) {
        this.toast.showToast('Passwords do not match', 'error');
        return;
      }
      const result = this.auth.register(this.username, this.email, this.password);
      if (result === 'success') {
        this.toast.showToast('Registered successfully', 'success');
        this.toggleMode();
      } else {
        this.toast.showToast(result, 'error');
      }
    }
  }
}
