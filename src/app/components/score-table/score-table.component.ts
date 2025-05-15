import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';  // Import this for ngModel
import { UtilsService } from 'src/app/services/utils.service';
import { Indicators } from './score-indicators-i';
import { PopoverController } from '@ionic/angular';
import { HelpPopoverComponent } from '../help-popover/help-popover.component';

@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, CommonModule, FormsModule,
    IonItem, IonGrid, IonRow, IonCol, IonList, IonListHeader, IonLabel, IonButton, IonSelect, IonSelectOption],
})
export class ScoreTableComponent implements OnInit, OnChanges {

  @Input() selectedPalette!: string;
  @Input() isLocked!: boolean;
  @Input() indicatorGroups!: Indicators;
  @Input() selectedRow!: string;

  hiddenRows: { [column: string]: { code: string, title: string }[] } = {};


  // Output property to send the selected country to the parent
  @Output() selectedCountyChange: EventEmitter<string> = new EventEmitter<string>();


  constructor(
    public utilsService: UtilsService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('MapComponent::ngOnChanges')
    if (changes['selectedPalette']) {
      // console.log('MapComponentComponent::ngOnChanges::mapInput: ', this.mapInput);
    }
  }

  ngOnInit() {
    console.log("ScoreTableComponent::ngOnInit")
  }

  onSelectIndicator(code: string) {
    // console.log("ScoreTableComponent::onSelectIndicator::code: " + code)
    this.selectedCountyChange.emit(code)

  }


  getColor(value: number | null) {
    return this.utilsService.getColor((value !== null ? value : null), this.selectedPalette)
  }

  hideRow(column: string, row: { code: string, title: string }) {
    // console.log("ScoreTableComponent::hideRow::row: " + row)
    if (!this.hiddenRows[column]) {
      this.hiddenRows[column] = [];
    }
    this.hiddenRows[column].push(row);
  }

  isHidden(column: string, code: string): boolean {
    const hidden = this.hiddenRows[column];
    // console.log("ScoreTableComponent::isHidden::hidden|column|code: ", hidden, column, code);
    return hidden ? hidden.some(row => row.code === code) : false;
  }

  unhideRow(column: string, code: string) {
    this.hiddenRows[column] = this.hiddenRows[column].filter(row => row.code !== code);
  }

  async presentPopover(ev: Event, row: any) {
    console.log("ScoreTableComponent::presentPopover::row: " + row)
    const popover = await this.popoverCtrl.create({
      component: HelpPopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        helpText: `This is help for ${row.title}.`,  // Customize this
        helpLink: `/help/${row.code}`               // Or a full URL
      }
    });
    await popover.present();
  }

}
