import { CommonModule } from '@angular/common';
// HttpClient not used directly; ApiService handles requests
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-userpayments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userpayments.html',
  styleUrl: './userpayments.css',
})
export class Userpayments implements OnDestroy {
  flat_id!: number;
  bookingId!: number;

  paymentId: number | null = null;
  amount: number | null = null;
  paymentStatus: 'pending' | 'completed' | null = null;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.bookingId = Number(this.route.snapshot.paramMap.get('booking_id'));
    this.loadBookingAndPayment();
  }

  ngOnDestroy() {
    this.loading = false;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  loadBookingAndPayment() {
    if (!this.bookingId) return;

    this.api.getBookingById(this.bookingId).subscribe({
      next: (booking) => {
        if (!booking || booking.booking_status !== 'approved') return;

        this.flat_id = booking.flat_id;
        this.bookingId = booking.booking_id;
        this.loadPaymentForBooking();
      },
      error: () => {
        console.error('Failed to load booking');
      },
    });
  }

  // 🔹 Load payment for the matched booking
  loadPaymentForBooking() {
    this.api.getMyPayments().subscribe({
      next: (payments) => {
        const payment = payments.find((p) => p.booking_id === this.bookingId);
        if (payment) {
          this.paymentId = payment.payment_id;
          this.amount = payment.amount;
          this.paymentStatus = payment.payment_status;
          this.cd.detectChanges();
        }
      },
      error: () => {
        console.error('Failed to load payments');
      },
    });
  }

  initiatePayment() {
    this.loading = true;

    this.api.initiatePayment(this.flat_id).subscribe({
      next: (res) => {
        this.paymentId = res.payment.payment_id;
        this.amount = res.payment.amount;
        this.paymentStatus = res.payment.payment_status;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        if (err.status === 409) {
          this.loadPaymentForBooking();
        } else {
          alert(err.error?.message || 'Payment initiation failed');
        }
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  // 🔹 STEP 2 — Confirm Payment
  confirmPayment() {
    if (!this.paymentId) return;

    this.loading = true;

    this.api.completePayment(this.paymentId).subscribe({
      next: () => {
        this.paymentStatus = 'completed';
        this.loading = false;
        this.cd.detectChanges();

        alert('Payment completed. Lease created.');
      },
      error: (err) => {
        alert(err.error?.message || 'Payment failed');
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }
  viewLease(){
    this.router.navigate(['/user/leases']);
  }
   viewpayments(){
    this.router.navigate(['/user/allpayments']);
  }
}
