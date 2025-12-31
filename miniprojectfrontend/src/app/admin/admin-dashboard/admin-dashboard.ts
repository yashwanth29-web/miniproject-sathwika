import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink , RouterOutlet],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
 
  username: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (payload.role !== 'admin') {
        this.router.navigate(['/unauthorized']);
        return;
      }

      this.username = payload.name;

    } catch (err) {
      console.error('Invalid token');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    localStorage.clear();
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
