import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonList, IonListHeader, IonLabel, IonItem } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';  // Import this for ngModel
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonItem, IonGrid, IonRow, IonCol, IonList, IonListHeader, IonLabel],
})
export class ScoreTableComponent implements OnInit {

  testValue: number = 74

  selectedPalette: string = 'bw'

  indicators_groups = [
    {
      col_title: 'Commercial', rows: [
        { code: '1', title: 'Rates', value: 134, pColor: 75, selected: true },
        { code: '2', title: 'Payers count', value: 24, pColor: 65, selected: false },
        { code: '3', title: 'Neworks count', value: 23, pColor: 45, selected: false },
        { code: '4', title: 'Entities count', value: 9, pColor: 25, selected: false }
      ]
    },
    {
      col_title: 'Medicaid', rows: [
        { code: '5', title: 'Rates', value: 134, pColor: 75, selected: false },
        { code: '6', title: 'Payers count', value: 24, pColor: 65, selected: false },
        { code: '7', title: 'Neworks count', value: 23, pColor: 45, selected: false },
        { code: '8', title: 'Entities count', value: 9, pColor: 25, selected: false }
      ]
    },
    {
      col_title: 'General', rows: [
        { code: '9', title: 'Rates', value: 134, pColor: 75, selected: false },
        { code: '10', title: 'Payers count', value: 24, pColor: 65, selected: false },
        { code: '11', title: 'Neworks count', value: 23, pColor: 45, selected: false },
        { code: '12', title: 'Entities count', value: 9, pColor: 25, selected: false }
      ]
    }
  ]


  constructor(
    public utilsService: UtilsService
  ) { }

  ngOnInit() {
    console.log("ScoreTableComponent::ngOnInit")
  }

  onSelectIndicator(code: string) {
    console.log("ScoreTableComponent::onSelectIndicator::code: " + code)

  }


  getColor(value: number | null) {
    return this.utilsService.getColor((value !== null ? value / 100 : null), this.selectedPalette)
  }

}
