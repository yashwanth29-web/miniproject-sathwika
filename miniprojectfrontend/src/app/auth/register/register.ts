import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
    standalone: true,
  imports: [FormsModule, RouterLink],
  styleUrl: './register.css',
})
export class Register {

  name = '';
  email = '';
  password = '';
  confirm_password = '';
  phone_num = '';
  role = '';

  constructor(private router: Router, private api: ApiService) {}

  register() {

    if (this.password !== this.confirm_password) {
      alert('Passwords do not match');
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      phone_num: this.phone_num,
      role: this.role,
      password: this.password,
      confirm_password: this.confirm_password,
    };

    this.api.register(data).subscribe({
      next: () => {
        alert('Registered successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(JSON.stringify(err.error));
        console.log(err);
      }
    });
  }
}
