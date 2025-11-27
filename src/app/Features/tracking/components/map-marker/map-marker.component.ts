import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-map-marker',
  standalone: false,
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.css']
})
export class MapMarkerComponent {
  @Input() name!: string;
  @Input() photo!: string;

static renderMarker(name: string, avatar: string, status: string): string {

  // نحدد الـ class حسب الحالة
  const statusClass =
    status === 'STARTED' ? 'status-started' :
    status === 'FINISHED' ? 'status-finished' :
    'status-offline';

  return `
    <div class="marker-wrapper ${statusClass}">
      <div class="pulse-ring"></div>

      <div class="marker-avatar">
        <img src="${avatar}" />
      </div>

      <span class="status-dot"></span>

      <div class="marker-name">${name}</div>
    </div>
  `;
}



}


