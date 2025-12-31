import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-config';

function authHeaders(token?: string) {
  const t = token ?? localStorage.getItem('token') ?? '';
  return { headers: new HttpHeaders({ Authorization: `Bearer ${t}` }) };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = API_BASE;

  constructor(private http: HttpClient) {}

  // Bookings
  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/bookingRoute/my-bookings`, authHeaders());
  }

  getBookingById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/bookingRoute/my-bookings/${id}`, authHeaders());
  }

  // Payments
  getMyPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/PaymentRoute/my-payments`, authHeaders());
  }

  initiatePayment(flat_id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/PaymentRoute/pay`, { flat_id }, authHeaders());
  }

  completePayment(paymentId: number): Observable<any> {
    return this.http.patch<any>(`${this.base}/PaymentRoute/pay/${paymentId}/complete`, {}, authHeaders());
  }

  // Auth
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.base}/authRoute/login`, { email, password });
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/authRoute/register`, data);
  }

  // Leases
  getMyLeases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/leaseRoute/my-leases`, authHeaders());
  }

  // Towers / Flats / Amenities (admin + user)
  getTowers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/TowerRoute/GetTowers`);
  }

  addTower(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/TowerRoute/AddTower`, payload);
  }

  deleteTower(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/TowerRoute/DeleteTower/${id}`);
  }

  getFlatsByTower(tower_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/FlatRoute/GetFlatsByTower/${tower_id}`);
  }

  addFlat(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/FlatRoute/AddFlat`, payload);
  }

  updateFlat(flat_id: number, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.base}/FlatRoute/UpdateFlat/${flat_id}`, payload);
  }

  deleteFlat(flat_id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/FlatRoute/DeleteFlat/${flat_id}`);
  }

  getAmenitiesByTower(tower_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/AmenitiesRoute/GetAmenitiesByTower/${tower_id}`);
  }

  addAmenity(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/AmenitiesRoute/AddAmenity`, payload);
  }

  updateAmenity(amenity_id: number, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.base}/AmenitiesRoute/UpdateAmenity/${amenity_id}`, payload);
  }

  deleteAmenity(amenity_id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/AmenitiesRoute/DeleteAmenity/${amenity_id}`);
  }

  // Booking actions
  createBooking(flat_id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/bookingRoute/book`, { flat_id }, authHeaders());
  }

  getPendingBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/bookingRoute/admin/pending-bookings`, authHeaders());
  }

  updateBookingStatus(bookingId: number, status: 'approved' | 'rejected'): Observable<any> {
    return this.http.patch<any>(`${this.base}/bookingRoute/bookings/${bookingId}`, { booking_status: status }, authHeaders());
  }

  // Feedback
  submitFeedback(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/FeedbackRoute/SubmitFeedback`, payload);
  }

  getAllFeedbacks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/FeedbackRoute/GetAllFeedbacks`);
  }
}
