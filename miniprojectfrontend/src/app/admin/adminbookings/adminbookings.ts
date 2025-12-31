import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-adminbookings',
  imports: [CommonModule , FormsModule],
  templateUrl: './adminbookings.html',
  styleUrl: './adminbookings.css',
})
export class Adminbookings {

  bookings: any[] = [];

  constructor(private api: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPendingBookings();
    this.cd.detectChanges();
  }

  loadPendingBookings() {
    this.api.getPendingBookings().subscribe(res => {
      this.bookings = res;
      console.log("bookings", this.bookings);
      this.cd.detectChanges();
    });
  }

  updateStatus(bookingId: number, status: 'approved' | 'rejected') {
    this.api.updateBookingStatus(bookingId, status).subscribe(() => {
      alert(`Booking ${status}`);
      this.loadPendingBookings();
      this.cd.detectChanges();
    });
  }
}
