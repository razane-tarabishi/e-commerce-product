import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'success';


  show = false;


  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
  this.message = message;
  this.type = type;
  this.show = true;

  setTimeout(() => {
    this.show = false;
  }, 3000);
}

}

