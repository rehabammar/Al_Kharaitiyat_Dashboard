import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/shared/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
})
export class LoadingSpinnerComponent {
constructor(public loadingService: LoadingService) {
  this.loadingService.loading$.subscribe(value => {
    console.log("Loading state changed:", value);
  });
}

}
