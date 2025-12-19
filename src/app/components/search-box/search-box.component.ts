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
  @Input() disabled: boolean;

  @Output() selectedItemChange: EventEmitter<string> = new EventEmitter<string>();

  searchQuery: string = '';
  filteredItems: { id: string, name: string }[] = [];
  showList: boolean = false;

  constructor() {
    this.disabled = false
  }

  ngOnInit() {
    // console.log('SearchBoxComponent::ngOnInit');
    this.filteredItems = [...this.items]; // Initialize with input items
  }

  /** Detect when `items` change and update `filteredItems` */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      // console.log('SearchBoxComponent::ngOnChanges::this.items: ', this.items);
      this.filteredItems = [...this.items]; // Update filtered list when input items change
    }
    if (changes['disabled']) {
      // console.log('SearchBoxComponent::ngOnChanges::this.disabled: ', this.disabled);
      this.filteredItems = [...this.items]; // Update filtered list when input items change
      this.valueChangedOrCleared({id: '', name: ''})
    }
  }

  filterItems() {
    const query = this.searchQuery.toLowerCase();
    this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(query));
  }

  selectItem(item: { id: string, name: string }) {
    console.log('SearchBoxComponent::selectItem::item:', item);
    this.valueChangedOrCleared(item)
  }

  hideListWithDelay() {
    setTimeout(() => {
      this.showList = false;
    }, 400); // Was 200ms: Small delay to allow click selection
  }

  onFocus() {
    console.log("Searchbar Focused!");
    this.showList = true;
  }

  onCancel() {
    // This event, calls onClear
    console.log("SearchBoxComponent::onCancel");
    console.log("SearchBoxComponent::onCancel::this.searchQuery: " + this.searchQuery)
  }

  onClear() {
    console.log("SearchBoxComponent::onClear");
    console.log("SearchBoxComponent::onClear::this.searchQuery: " + this.searchQuery)
  }

  onBlur() {
    console.log("SearchBoxComponent::onBlur");
    console.log("SearchBoxComponent::onBlur::this.searchQuery: " + this.searchQuery)
    this.hideListWithDelay();
    // if(this.searchQuery === '') {
    //   this.selectItem({id: '', name: ''})
    // }
  }

  onChange() {
    console.log("SearchBoxComponent::onChange");
    console.log("SearchBoxComponent::onChange::this.searchQuery: " + this.searchQuery)
    if(this.searchQuery === '') {
      this.valueChangedOrCleared({id: '', name: ''})
    }

  }

  valueChangedOrCleared(item: { id: string, name: string }) {
    console.log(`SearchBoxComponent::valueChangedOrCleared::item:' ${item} [${this.placeholder}]`);
    this.searchQuery = item.name;
    this.showList = false; // Hide list after selection
    this.selectedItemChange.emit(item.id); // Emit selected item
  }

}
