import { Routes } from '@angular/router';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { Admintowers } from './admin/admintowers/admintowers';
import { Adminbookings } from './admin/adminbookings/adminbookings';
import { AdminHome } from './admin/admin-home/admin-home';
import { Userbookings } from './user/userbookings/userbookings';
import { Userpayments } from './user/userpayments/userpayments';
import { Userlease } from './user/userlease/userlease';
import { Userhome } from './user/userhome/userhome';
import { Userdashboard } from './user/userdashboard/userdashboard';
import { Alluserpayments } from './user/alluserpayments/alluserpayments';
import { Landing } from './landing/landing';
import { Feedback } from './feedback/feedback';

export const routes: Routes = [
    {path: "register", component:Register},

    {path: "", component:Landing},  

    {path:"login", component:Login},

    {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' } ,
   children: [
  { path: '', redirectTo: 'admintowers', pathMatch: 'full' }, // ✅ default
  { path: 'admintowers', component: Admintowers },
  { path: 'adminbookings', component: Adminbookings },       // ✅ REAL PATH
  { path: 'adminfeedback', component: AdminHome },
]

  },

  {
    path: 'user',
    component: Userhome,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'user' },
    children: [
    { path: 'mybookings', component: Userbookings},
    { path: 'payments/:booking_id', component: Userpayments },
    { path: 'leases', component: Userlease },
    { path: '', component:Userdashboard },
        { path: 'feedback', component:Feedback },

    {path:"allpayments", component:Alluserpayments}
  ]
  }
]