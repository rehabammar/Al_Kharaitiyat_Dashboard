import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { TeacherTracking } from '../../models/teacher-tracking.model';
import { TeachersTrackingService } from '../../services/tracking.service';
import { MapMarkerComponent } from '../map-marker/map-marker.component';
import { Subscription } from 'rxjs';
import { MessagingBridgeService } from '../../../../core/services/shared/messaging-bridge.service';
import { MatDialog } from '@angular/material/dialog';
import { ClassDetailsFormComponent } from '../../../home/components/class-details-form/class-details-form.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-teachers-tracking',
  templateUrl: './teachers-tracking.component.html',
  styleUrls: ['./teachers-tracking.component.css'],
  standalone: false
})
export class TeachersTrackingComponent implements AfterViewInit, OnDestroy {

  private sub?: Subscription;
  private refreshInterval?: any;

  map!: L.Map;
  markers: L.Marker[] = [];

  searchTerm = '';
  teachers: TeacherTracking[] = [];

  female_avatar = 'assets/img/gallery/female_avatar.svg';
  male_avatar = 'assets/img/gallery/male_avatar.svg';

  sidebarOpen = false;

  constructor(
    private trackingService: TeachersTrackingService,
    private bridge: MessagingBridgeService,
    private dialog: MatDialog
  ) {}

  /* =============================
   * Lifecycle
   * ============================= */

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => this.loadTeachers(), 150);

    this.sub = this.bridge.events$.subscribe(e => {
      if (e?.type === 'REFRESH') {
        this.refreshTeacherLocations();
      }
    });

    this.refreshInterval = setInterval(() => {
      this.refreshTeacherLocations();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  /* =============================
   * Load Teachers
   * ============================= */

  loadTeachers() {
    this.trackingService.getTodayTeachersStatus().subscribe(data => {
      this.teachers = data.map(t => ({
        ...t,
        selected: true
      }));
      this.updateMarkers(true);
    });
  }

  refreshTeacherLocations() {
    this.trackingService.getTodayTeachersStatus().subscribe(data => {
      this.teachers = data.map(newTeacher => {
        const old = this.teachers.find(
          t => t.teacherUserPk === newTeacher.teacherUserPk
        );
        return {
          ...newTeacher,
          selected: old ? old.selected : false
        };
      });
      this.updateMarkers(false);
    });
  }

  /* =============================
   * Map Init
   * ============================= */

  initMap() {
    this.map = L.map('map', {
      center: [25.3434, 49.5656],
      zoom: 6
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    setTimeout(() => this.map.invalidateSize(), 400);
  }

  /* =============================
   * Search
   * ============================= */

  filteredTeachers() {
    const term = (this.searchTerm || '').trim();
    if (!term) return this.teachers;

    const isNumeric = /^[0-9]+$/.test(term);

    return this.teachers.filter(t =>
      isNumeric
        ? t.teacherUserPk?.toString().includes(term)
        : (t.teacherFullName || '').toLowerCase().includes(term.toLowerCase())
    );
  }

  /* =============================
   * Selection
   * ============================= */

  onTeacherToggle(teacher: TeacherTracking) {
    teacher.selected = !teacher.selected;
    this.updateMarkers(true);
  }

  selectAll() {
    this.teachers.forEach(t => (t.selected = true));
    this.updateMarkers(true);
  }

  clearAll() {
    this.teachers.forEach(t => (t.selected = false));
    this.updateMarkers(true);
  }

  /* =============================
   * Marker Helpers
   * ============================= */

  photoUrl(u: TeacherTracking): string {
    return u.genderFk === 1 ? this.male_avatar : this.female_avatar;
  }

  /* =============================
   * Update Markers
   * ============================= */

  updateMarkers(allowFocus: boolean) {
    if (!this.map) return;

    this.markers.forEach(m => {
      if (this.map.hasLayer(m)) {
        this.map.removeLayer(m);
      }
    });
    this.markers = [];

    const group = L.featureGroup();

    const validTeachers = this.teachers.filter(t => {
      const lat = Number(t.locationStartLat);
      const lng = Number(t.locationStartLong);
      return (
        t.selected &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat !== 0 &&
        lng !== 0
      );
    });

    validTeachers.forEach(t => {
      const html = MapMarkerComponent.renderMarker(
        t.teacherFullName || '',
        this.photoUrl(t),
        t.teacherStatus || 'OFFLINE'
      );

      const marker = L.marker(
        [Number(t.locationStartLat), Number(t.locationStartLong)],
        {
          icon: L.divIcon({
            html,
            className: 'my-teacher-marker',
            iconSize: [45, 50],
            iconAnchor: [22, 45]
          })
        }
      );

      marker.on('click', () => {
        if (t.classPk) this.openClass(t.classPk);
      });

      marker.addTo(this.map);
      this.markers.push(marker);
      group.addLayer(marker);
    });

    if (!allowFocus || this.markers.length === 0) return;

    setTimeout(() => {
      if (this.markers.length === 1) {
        this.map.flyTo(this.markers[0].getLatLng(), 15);
      } else {
        this.map.fitBounds(group.getBounds(), { padding: [40, 40] });
      }
    }, 120);
  }

  /* =============================
   * Dialog
   * ============================= */

  openClass(classPk: number) {
    this.dialog.open(ClassDetailsFormComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { classId: classPk },
      autoFocus: false
    }).afterClosed().pipe(take(1)).subscribe();
  }
}
