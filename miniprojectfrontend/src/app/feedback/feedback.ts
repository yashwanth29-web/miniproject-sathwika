import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  imports: [CommonModule , FormsModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback {
 feedback = {
    name: '',
    email: '',
    message: '',
  };

  successMsg = '';

  constructor(private api: ApiService) {}

submitFeedback() {
  if (!this.feedback.name || !this.feedback.email || !this.feedback.message) {
    return;
  }

  this.api.submitFeedback(this.feedback).subscribe({
    next: () => {
      this.successMsg = 'Thank you for your feedback!';
      this.feedback = { name: '', email: '', message: '' };
    },
    error: (err) => {
      console.error('Frontend error:', err);
    }
  });
}
  }