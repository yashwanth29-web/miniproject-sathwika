import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-userhome',
  imports: [ CommonModule , FormsModule , RouterOutlet , RouterLink],
  templateUrl: './userhome.html',
  styleUrl: './userhome.css',
})
export class Userhome {
  username = '';
  constructor(private router: Router ) { }
 ngOnInit(): void {
const storedUser = localStorage.getItem('username');
if (storedUser) this.username = storedUser;

  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

}
