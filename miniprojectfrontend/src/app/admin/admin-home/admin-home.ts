import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-home',
  imports: [CommonModule],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHome {
 feedbacks: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(private api: ApiService , private cd : ChangeDetectorRef) {}

  ngOnInit() {
    this.getAllFeedbacks();
  }

  getAllFeedbacks() {
    this.api.getAllFeedbacks().subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching feedbacks', err);
        this.errorMsg = 'Failed to load feedbacks.';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }
}
