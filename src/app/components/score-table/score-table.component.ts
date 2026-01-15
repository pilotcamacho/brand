import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';  // Import this for ngModel
import { UtilsService } from 'src/app/services/utils.service';
import { Indicators } from './score-indicators-i';
import { PopoverController } from '@ionic/angular';
import { HelpPopoverComponent } from '../help-popover/help-popover.component';

interface FlatIndicatorRow {
  col_title: string;
  code: string;
  title: string;
  value: number;
}

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
        // helpText: `Source for ${row.title}.`,  // Customize this
        helpText: `Source for ${row.help}.`,  // Customize this
        helpLink: `${row.help}`
      }
    });
    await popover.present();
  }


  download(): void {

    console.log("ScoreTableComponent::download")
    // this.utilsService.downloadCSV(this.indicatorGroups, this.selectedPalette);
    // console.log("ScoreTableComponent::download()::this.indicatorGroups::" + JSON.stringify(this.indicatorGroups))

    const data = this.flattenIndicators(this.indicatorGroups);

    // console.log("ScoreTableComponent::download()::data::" + JSON.stringify(data))


    const csv = this.jsonToCsv(data);
    if (!csv) {
      return;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'indicators.csv';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }


  private jsonToCsv(data: any[]): string {
    if (!data || !data.length) {
      return '';
    }

    const headers = Object.keys(data[0]);

    const csvRows = [
      headers.join(','), // header row
      ...data.map(row =>
        headers.map(h => {
          const val = row[h] ?? '';
          // Escape quotes and wrap fields containing commas/newlines
          const escaped = String(val).replace(/"/g, '""');
          return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
        }).join(',')
      )
    ];

    return csvRows.join('\n');
  }

  flattenIndicators(indicators: Indicators): FlatIndicatorRow[] {
    return indicators.columns.flatMap(column =>
      column.rows.map(row => ({
        col_title: column.col_title,
        code: row.code,
        title: row.title,
        value: row.value
      }))
    );
  }


}
