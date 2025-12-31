import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-userlease',
  imports: [CommonModule],
  templateUrl: './userlease.html',
  styleUrl: './userlease.css',
})
export class Userlease {
leases: any[] = [];
  loading = false;

  constructor(private api: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchLeases();
  }

  fetchLeases() {
    this.loading = true;
    this.api.getMyLeases().subscribe({
      next: (res) => {
        this.leases = res;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        alert('Failed to load leases');
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }
}
