import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-field',
  standalone: false,
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.css'
})
export class SearchFieldComponent {
  @Input() label = '';                    
  @Input() value = '';                     
  @Input() disabled = true;               
  @Input() showClear = true;               
  @Input() radius = 14;                  

  @Output() search = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  onSearchClick() { this.search.emit(); }
  onClearClick() { if (!this.disabled) return; this.clear.emit(); }

}
