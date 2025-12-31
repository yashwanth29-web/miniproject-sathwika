import { CommonModule } from '@angular/common';
// HttpClient not used directly; ApiService handles requests
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-userbookings',
  standalone: true,
  imports: [CommonModule , RouterOutlet],
  templateUrl: './userbookings.html',
  styleUrls: ['./userbookings.css'],
})
export class Userbookings {
  paidBookings: number[] = [];

  bookings: any;
  loading: boolean = false;

  apiUrl = '';

  constructor(private cd: ChangeDetectorRef, private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.loadMyBookings();
    console.log('bookings  :',this.bookings);
    this.cd.detectChanges();
    
  }
  payNow(booking_id: number) {
    if (!booking_id) {
      alert('Booking id not available.');
      return;
    }

    this.router.navigate(['/user/payments', booking_id]);
  }

loadMyPayments() {
  this.api.getMyPayments().subscribe({
    next: (payments) => {
      payments.forEach((p) => {
        if (p.payment_status === 'completed') {
          this.paidBookings.push(p.booking_id);
        }
      });

      this.cd.detectChanges();
    },
    error: () => {
      console.log('Could not load payments');
    },
  });
}

  loadMyBookings() {
    this.loading = true;

    this.api.getMyBookings().subscribe({
      next: (res) => {
        this.bookings = res;
        console.log('User bookings loaded:', this.bookings);
        this.loading = false;
        this.loadMyPayments();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
}
