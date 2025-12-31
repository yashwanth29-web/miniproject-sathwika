import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-alluserpayments',
  imports: [CommonModule],
  templateUrl: './alluserpayments.html',
  styleUrl: './alluserpayments.css',
})
export class Alluserpayments {
  payments: any[] = [];
  loading = false;

  constructor(private api: ApiService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPayments();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  loadPayments() {
    this.loading = true;

    this.loading = true;
    this.api.getMyPayments().subscribe({
      next: (res) => {
        this.payments = res;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        alert('Failed to load payments');
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  confirmPayment(paymentId: number) {
    if (!confirm('Confirm this payment?')) return;

    this.api.completePayment(paymentId).subscribe({
      next: () => {
        alert('Payment completed');
        this.loadPayments();
      },
      error: (err) => {
        alert(err.error?.message || 'Payment failed');
      },
    });
}
}