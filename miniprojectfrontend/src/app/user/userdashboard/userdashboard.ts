import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Userbookings } from '../userbookings/userbookings';
import { Alluserpayments } from '../alluserpayments/alluserpayments';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Userbookings, Alluserpayments],
  templateUrl: './userdashboard.html',
  styleUrls: ['./userdashboard.css'],
})
export class Userdashboard {

  username = 'User';

  towers: any[] = [];

  availableFlats: { [key: number]: any[] } = {};
  amenities: { [key: number]: any[] } = {};

  loadingTowers = false;
  loadingFlats: { [key: number]: boolean } = {};
  loadingAmenities: { [key: number]: boolean } = {};

  userBookings: number[] = []; // store flat_ids already booked

  constructor(private router: Router, private cd: ChangeDetectorRef, private api: ApiService) {}

  ngOnInit(): void {
    this.loadTowers();
    this.loadMyBookings(); // load user's existing bookings

    const storedUser = localStorage.getItem('username');
    if (storedUser) this.username = storedUser;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loadTowers() {
    this.loadingTowers = true;

    this.api.getTowers().subscribe({
      next: (res) => {
        this.towers = res;
        this.loadingTowers = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingTowers = false;
      },
    });
  }

  loadMyBookings() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.api.getMyBookings().subscribe({
      next: (res) => {
        this.userBookings = res.map(b => b.flat_id);
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  showAvailableFlats(tower_id: number) {
    this.loadingFlats[tower_id] = true;

    this.api.getFlatsByTower(tower_id).subscribe({
      next: (res) => {
        this.availableFlats[tower_id] = res.filter(f => f.availability === 'available');
        this.loadingFlats[tower_id] = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingFlats[tower_id] = false;
      },
    });
  }

  showAmenities(tower_id: number) {
    this.loadingAmenities[tower_id] = true;

    const token = localStorage.getItem('token');

    this.api.getAmenitiesByTower(tower_id).subscribe({
      next: (res) => {
        this.amenities[tower_id] = res;
        this.loadingAmenities[tower_id] = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingAmenities[tower_id] = false;
      },
    });
  }

  bookFlat(flat: any) {
    if (!flat.flat_id) return alert('Invalid flat selected');

    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');

    if (this.userBookings.includes(flat.flat_id)) return alert('You have already booked this flat');

    this.api.createBooking(flat.flat_id).subscribe({
      next: () => {
        alert('Booking requested!');
        this.userBookings.push(flat.flat_id);
        for (const towerId in this.availableFlats) {
          this.availableFlats[towerId] = this.availableFlats[towerId].filter(f => f.flat_id !== flat.flat_id);
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Booking failed');
      },
    });
  }
}
