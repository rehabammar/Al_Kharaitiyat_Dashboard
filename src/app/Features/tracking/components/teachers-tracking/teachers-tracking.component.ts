import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { TeacherTracking } from '../../models/teacher-tracking.model';
import { TeachersTrackingService } from '../../services/tracking.service';
import { MapMarkerComponent } from '../map-marker/map-marker.component';

@Component({
  selector: 'app-teachers-tracking',
  templateUrl: './teachers-tracking.component.html',
  styleUrls: ['./teachers-tracking.component.css'],
  standalone: false
})
export class TeachersTrackingComponent implements AfterViewInit {

  constructor(private trackingService: TeachersTrackingService) { }

  map!: L.Map;
  markers: L.Marker[] = [];

  searchTerm = "";
  teachers: TeacherTracking[] = [];

  female_avatar = 'assets/img/gallery/female_avatar.svg';
  male_avatar = 'assets/img/gallery/male_avatar.svg';



  
    //  private sub?: Subscription;
  
    // constructor(private bridge: MessagingBridgeService) {}
  
    // ngAfterViewInit(): void {
    //   this.sub = this.bridge.events$.subscribe(e => {
    //     if (e?.type === 'REFRESH') {
    //       this.loadTeachers();
    //     }
    //   });
    // }
  

  ngAfterViewInit(): void {
    this.loadTeachers();
    setTimeout(() => this.initMap(), 150);
  }

  // =============================
  // Load today's teachers status
  // =============================
  loadTeachers() {
    this.trackingService.getTodayTeachersStatus().subscribe(data => {
      this.teachers = data.map(t => ({
        ...t,
        selected: false,
        lat: t.locationStartLat,
        lng: t.locationStartLong,
        avatar: t.profileUrl
      }));
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
    return this.teachers.filter(t =>
      (t.teacherFullName || "").includes(this.searchTerm)
    );
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
    // Remove old markers
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    const group = L.featureGroup();

    this.teachers.filter(t => t.selected).forEach(t => {
      if (!t.locationStartLat || !t.locationStartLong) return;

      // Marker HTML with status
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

      const marker = L.marker([t.locationStartLat, t.locationStartLong], { icon });

      marker.addTo(this.map);
      this.markers.push(marker);
      group.addLayer(marker);
    });

    if (this.markers.length > 0) {
      this.map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }
}
