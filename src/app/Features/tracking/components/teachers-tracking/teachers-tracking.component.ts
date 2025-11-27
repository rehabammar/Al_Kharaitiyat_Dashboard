import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { TeacherTracking } from '../../models/teacher-tracking.model';
import { TeachersTrackingService } from '../../services/tracking.service';
import { MapMarkerComponent } from '../map-marker/map-marker.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { MessagingBridgeService } from '../../../../core/services/shared/messaging-bridge.service';
import { MatDialog } from '@angular/material/dialog';
import { ClassDetailsFormComponent } from '../../../home/components/class-details-form/class-details-form.component';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-teachers-tracking',
  templateUrl: './teachers-tracking.component.html',
  styleUrls: ['./teachers-tracking.component.css'],
  standalone: false
})
export class TeachersTrackingComponent implements AfterViewInit {

  private sub?: Subscription;

  constructor(
    private trackingService: TeachersTrackingService,
    private bridge: MessagingBridgeService,
    private dialog: MatDialog
  ) { }

  map!: L.Map;
  markers: L.Marker[] = [];

  searchTerm = "";
  teachers: TeacherTracking[] = [];

  female_avatar = 'assets/img/gallery/female_avatar.svg';
  male_avatar = 'assets/img/gallery/male_avatar.svg';


  ngAfterViewInit(): void {
  this.initMap();                 
  setTimeout(() => this.loadTeachers(), 150); 
  this.sub = this.bridge.events$.subscribe(e => {
    if (e?.type === 'REFRESH') {
      this.refreshTeacherLocations();
    }
  });
}



  // =============================
  // Load today's teachers status
  // =============================
loadTeachers() {
  this.trackingService.getTodayTeachersStatus().subscribe(data => {
    this.teachers = data.map(t => ({
      ...t,
      selected: true,
    }));

    this.updateMarkers();
  });
}





  // =============================
  // Init Leaflet Map
  // =============================
  initMap() {
    this.map = L.map('map', { center: [25.3434, 49.5656], zoom: 6 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    setTimeout(() => this.map.invalidateSize(), 400);
  }

  // =============================
  // Search
  // =============================
 filteredTeachers() {
  const term = (this.searchTerm || "").trim();

  if (term === "") return this.teachers;

  const isNumeric = /^[0-9]+$/.test(term);

  return this.teachers.filter(t => {
    if (isNumeric) {
      return t.teacherUserPk?.toString().includes(term);
    } else {
      return (t.teacherFullName || "")
        .toLowerCase()
        .includes(term.toLowerCase());
    }
  });
}


  // =============================
  // Selection
  // =============================
  onTeacherToggle(teacher: TeacherTracking) {
    teacher.selected = !teacher.selected;
    this.updateMarkers();
  }

  selectAll() {
    this.teachers.forEach(t => t.selected = true);
    this.updateMarkers();
  }

  clearAll() {
    this.teachers.forEach(t => t.selected = false);
    this.updateMarkers();
  }

  // =============================
  // Update Map Markers
  // =============================

  photoUrl(u: TeacherTracking): string {
    // const raw = (u.profileUrl ?? '').trim();
    // if (!raw) {
    if (u.genderFk == 1) return this.male_avatar;
    else return this.female_avatar;
    // return this.male_avatar;
    // }


    // // collapse accidental double slashes (but keep "http://" intact)
    // const fixed = raw.replace(/([^:]\/)\/+/g, '$1');

    // // if absolute URL, use it as-is
    // if (/^https?:\/\//i.test(fixed)) return fixed;
    // return "";
  }

updateMarkers() {

  // =============================
  // 1) SAFE: لو الماب لسه متعملتش
  // =============================
  if (!this.map) {
    console.warn('Map not initialized yet, skipping marker update.');
    return;
  }

  // =============================
  // 2) Remove old markers safely
  // =============================
  this.markers.forEach(m => {
    if (m && this.map.hasLayer(m)) {
      this.map.removeLayer(m);
    }
  });
  this.markers = [];

  const group = L.featureGroup();

  // =============================
  // 3) Filter valid teachers ONLY
  // =============================
  const validTeachers = this.teachers.filter(t => {
    const lat = Number(t.locationStartLat);
    const lng = Number(t.locationStartLong);

    return (
      t.selected &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat !== 0 &&
      lng !== 0 &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180
    );
  });

  // =============================
  // 4) Add markers safely
  // =============================
  validTeachers.forEach(t => {

    const lat = Number(t.locationStartLat);
    const lng = Number(t.locationStartLong);

    const html = MapMarkerComponent.renderMarker(
      t.teacherFullName || "",
      this.photoUrl(t),
      t.teacherStatus || "OFFLINE"
    );

    const icon = L.divIcon({
      html,
      className: "my-teacher-marker",
      iconSize: [45, 50],
      iconAnchor: [22, 45]
    });

    const marker = L.marker([lat, lng], { icon });

    if (marker && this.map) {

      // ⭐ CLICK EVENT → OPEN CLASS
      marker.on('click', () => {
        if (t.classPk) {
          this.openClass(t.classPk);
        }
      });

      marker.addTo(this.map);
      this.markers.push(marker);
      group.addLayer(marker);
    }
  });

  // =============================
  // 5) No markers? → Stop safely
  // =============================
  if (this.markers.length === 0) {
    console.warn('No valid markers to display.');
    return;
  }

  // =============================
  // 6) Resize & Auto-Focus
  // =============================
  setTimeout(() => {

    if (!this.map) return;

    this.map.invalidateSize();

    if (this.markers.length === 1) {
      // focus on single teacher
      this.map.flyTo(this.markers[0].getLatLng(), 15, {
        animate: true,
        duration: 0.6
      });
    } else {
      // fit all teachers on the screen
      this.map.fitBounds(group.getBounds(), {
        padding: [40, 40],
        animate: true,
        duration: 0.6
      });
    }

  }, 150);
}


openClass(classPk: number) {
  const ref = this.dialog.open(ClassDetailsFormComponent, {
    width: '900px',
    maxWidth: '95vw',
    data: { classId: classPk },
    autoFocus: false
  });

  ref.afterClosed().pipe(take(1)).subscribe((shouldReload: boolean) => {
    if (shouldReload) {
      this.sub?.unsubscribe();
    }
  });
}



refreshTeacherLocations() {
  this.trackingService.getTodayTeachersStatus().subscribe(data => {

    const updatedList = data.map(newTeacher => {
      const oldTeacher = this.teachers.find(t => t.teacherUserPk === newTeacher.teacherUserPk);

      return {
        ...newTeacher,
        selected: oldTeacher ? oldTeacher.selected : true
      };
    });

    this.teachers = updatedList;
    this.updateMarkers();
  });
}



}
