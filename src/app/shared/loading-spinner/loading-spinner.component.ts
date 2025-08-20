import { Component } from '@angular/core';
import { LoadingService } from '../../services/shared/loading.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
  imports:[CommonModule , AsyncPipe]
})
export class LoadingSpinnerComponent {
constructor(public loadingService: LoadingService) {
  this.loadingService.loading$.subscribe(value => {
    console.log("Loading state changed:", value);
  });
}

}
