import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { IonSearchbar, IonList, IonItem } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';  // Import this for ngModel
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  standalone: true,
  imports: [IonItem, IonList, IonSearchbar, FormsModule, NgFor, NgIf],
})
export class SearchBoxComponent implements OnInit, OnChanges { // Implement OnChanges

  @Input() items: { id: string, name: string }[] = [];
  @Input() placeholder!: string;

  @Output() selectedItemChange: EventEmitter<string> = new EventEmitter<string>();

  searchQuery: string = '';
  filteredItems: { id: string, name: string }[] = [];
  showList: boolean = false;

  constructor() {}

  ngOnInit() {
    console.log('SearchBoxComponent::ngOnInit');
    this.filteredItems = [...this.items]; // Initialize with input items
  }

  /** Detect when `items` change and update `filteredItems` */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      console.log('Items updated:', this.items);
      this.filteredItems = [...this.items]; // Update filtered list when input items change
    }
  }

  filterItems() {
    const query = this.searchQuery.toLowerCase();
    this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(query));
  }

  selectItem(item: { id: string, name: string }) {
    console.log('Selected item:', item);
    this.searchQuery = item.name;
    this.showList = false; // Hide list after selection
    this.selectedItemChange.emit(item.id); // Emit selected item
  }

  hideListWithDelay() {
    setTimeout(() => {
      this.showList = false;
    }, 200); // Small delay to allow click selection
  }

  onFocus() {
    console.log("Searchbar Focused!");
    this.showList = true;
  }

  onBlur() {
    console.log("Searchbar Lost Focus!");
    this.hideListWithDelay();
  }
}
