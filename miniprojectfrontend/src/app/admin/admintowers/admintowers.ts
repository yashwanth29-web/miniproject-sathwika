import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admintowers',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admintowers.html',
  styleUrl: './admintowers.css',
})
export class Admintowers implements OnInit {

  apiTowerUrl = '';
  apiFlatUrl = '';
  apiAmenityUrl = '';

  towers: any[] | null = null;

  showAddTower = false;
  activeTowerForFlat: any = null;
  activeTowerForAmenity: any = null;

  flatsByTower: { [key: number]: any[] } = {};
  amenitiesByTower: { [key: number]: any[] } = {};

  constructor(private api: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTowers();
  }

  loadTowers(): void {
    this.api.getTowers().subscribe(res => {
      this.towers = [...res];
      this.cd.detectChanges();
    });
  }

  addTower(form: NgForm): void {
    if (!form.valid) return;

    this.api.addTower(form.value).subscribe(() => {
      form.resetForm();
      this.showAddTower = false;
      this.loadTowers();
      this.cd.detectChanges();
    });
  }

  deleteTower(id: number): void {
    if (!confirm('Delete tower?')) return;
    this.api.deleteTower(id).subscribe(() => this.loadTowers());
    this.cd.detectChanges();
  }

  // ===== Flats =====
  openFlatForm(tower: any): void {
    this.activeTowerForFlat = tower;
    this.activeTowerForAmenity = null;
  }

  addFlat(form: NgForm): void {
    if (!form.valid) return;

    const payload = {
      ...form.value,
      tower_id: this.activeTowerForFlat.tower_id
    };

    this.api.addFlat(payload).subscribe(() => {
      form.resetForm();
      this.activeTowerForFlat = null;
      this.loadFlats(payload.tower_id);
      this.cd.detectChanges();
    });
  }

  loadFlats(tower_id: number): void {
    this.api.getFlatsByTower(tower_id).subscribe(res => {
      this.flatsByTower[tower_id] = res.map(f => ({
        ...f,
        isEditing: false
        
      }));
    });
  }

  updateFlat(flat: any): void {
    const payload = {
      flat_number: flat.flat_number,
      rent: flat.rent,
      availability: flat.availability
    };

    this.api.updateFlat(flat.flat_id, payload).subscribe(() => {
      flat.isEditing = false;
    });
  }

  deleteFlat(flat_id: number, tower_id: number): void {
    if (!confirm('Delete flat?')) return;
    this.api.deleteFlat(flat_id).subscribe(() => this.loadFlats(tower_id));
  }

  // ===== Amenities =====
  openAmenityForm(tower: any): void {
    this.activeTowerForAmenity = tower;
    this.activeTowerForFlat = null;
  }

  addAmenity(form: NgForm): void {
    if (!form.valid) return;

    const payload = {
      ...form.value,
      tower_id: this.activeTowerForAmenity.tower_id
    };

    this.api.addAmenity(payload).subscribe(() => {
      form.resetForm();
      this.activeTowerForAmenity = null;
      this.loadAmenities(payload.tower_id);
    });
  }

  loadAmenities(tower_id: number): void {
    this.api.getAmenitiesByTower(tower_id).subscribe(res => {
      this.amenitiesByTower[tower_id] = res.map(a => ({
        ...a,
        isEditing: false
      }));
    });
  }

  updateAmenity(amenity: any): void {
    const payload = {
      amenity_name: amenity.amenity_name,
      description: amenity.description
    };

    this.api.updateAmenity(amenity.amenity_id, payload).subscribe(() => {
      amenity.isEditing = false;
    });
  }

  deleteAmenity(id: number, tower_id: number): void {
    if (!confirm('Delete amenity?')) return;
    this.api.deleteAmenity(id).subscribe(() => this.loadAmenities(tower_id));
  }

  trackByTowerId(index: number, tower: any): number {
    return tower.tower_id;
  }
}
