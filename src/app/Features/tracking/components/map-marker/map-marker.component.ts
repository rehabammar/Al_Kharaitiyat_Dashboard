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
    const statusColor = status === 'ONLINE' ? '#1cc88a' : '#e74a3b';

    return `
    <div class="marker-wrapper">
      <div class="pulse-ring"></div>

      <div class="marker-avatar">
        <img src="${avatar}" />
      </div>

      <span class="status-dot" style="background:${statusColor}"></span>

      <div class="marker-name">${name}</div>
    </div>
    `;
  }

}


