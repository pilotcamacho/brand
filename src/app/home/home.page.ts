import { AfterViewInit, Component, OnInit } from '@angular/core';

import { signOut } from 'aws-amplify/auth'

import { UsuarioService } from '../services/usuario.service';
import { DdbService } from '../services/ddb.service';
import { MapInput, Region, RegionType } from '../components/map-component/map-input';
import { ColumnInfoByRegion } from '../services/county-data/column-info';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ColumnData, Variable } from '../services/county-data/county-data-i';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnInit {

  //////////  DATA //////////////////////////////////////////////////////////////////////

  // List of payors
  payors = [
    { id: '7218e478-2e12-4993-a492-fd1c2358b24e', name: 'UnitedHealthcare' },
  ];

  // List of codes
  codes = [
    { id: '97151', name: '97151' },
    { id: '97152', name: '97152' },
    { id: '97153', name: '97153' },
    { id: '97154', name: '97154' },
    { id: '97155', name: '97155' },
    { id: '97156', name: '97156' },
    { id: '97157', name: '97157' },
    { id: '97158', name: '97158' },
  ];


  //////////  PAGE COMPONENTS  //////////////////////////////////////////////////////////////////////

  columnsMedicaid: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }[] = []
  columnsRates: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }[] = []
  columnsCommercial: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }[] = []
  columnsGeneral: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }[] = []




  //////////  PAGE STATE  //////////////////////////////////////////////////////////////////////

  selectedRegion: Region = {
    type: RegionType.COUNTRY,
    name: 'USA',
    code: 'USA',
    codeFP: null
  }

  selectedColumn!: Variable; //{ stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string };

  selPayor: string | undefined = '7218e478-2e12-4993-a492-fd1c2358b24e';

  selCode: string | undefined = '97151';


  //////////  PAGE VIEW  //////////////////////////////////////////////////////////////////////

  countiesVisible: boolean = true;

  chartStandardView = false;

  isListOpen = {
    medicaidList: true,
    ratesList: false,
    commercialList: false,
    generalList: false
  };

  toggleList(listName: 'medicaidList' | 'ratesList' | 'commercialList' | 'generalList'): void {
    this.isListOpen[listName] = !this.isListOpen[listName];
  }

  mapInput: MapInput;

  constructor(
    private toastController: ToastController,
    private route: ActivatedRoute,
    public usuarioSrv: UsuarioService,
    public dynamoDB: DdbService
  ) {
    this.selectedColumn = { code: '', name: '', description: '', type: '', format: '00' }
    this.mapInput = this.dynamoDB.getMapInput(RegionType.COUNTRY, 'USA', this.selectedColumn, '06', 'ZZ', this.selCode);
  }

  ngOnInit() {
    console.log('HomePage::ngOnInit');
    const stateId = this.route.snapshot.paramMap.get('stateId');
    console.log('HomePage::ngOnInit::stateId: ' + stateId)
  }

  ngAfterViewInit() {
    // Code to run after the page is fully loaded
    // this.selectedColumn = this.columnsMedicaid[1]
    console.log('HomePage::ngAfterViewInit::Page fully loaded and view initialized');
    // this.selectedColumn = this.columns[0]
  }


  onClickMapa(event: any) {
    console.log('HomePage::onClickMapaGrande')
    this.updateColumnsInfo({ type: RegionType.COUNTRY, name: 'USA', code: 'USA', codeFP: '' });
    this.mapInput = this.dynamoDB.getMapInput(RegionType.COUNTRY, 'USA', this.selectedColumn, '06', 'ZZ', this.selCode)
    // this.onClickChart(event)
  }

  updateColumnsInfo(countyInfo: { type: RegionType, name: string, code: string, codeFP: string }) {

  }


  selectedCountyFromChild: string = '';  // To store the value received from the child

  signOut() {
    console.log('about to signOut ....')
    signOut().then(() => console.log('signed out!'));
  }


  onRadioChange() {
    console.log('HomePage::onRadioChange::')
    this.mapInput = this.dynamoDB.getMapInput(RegionType.COUNTRY, 'USA', this.selectedColumn, '06', 'ZZ', this.selCode);
    console.log(`HomePage::onRadioChange::this.mapInput: ${JSON.stringify(this.mapInput)}`)
  }

  onSelectedCountyChange(county: any): void {

  }

  onClickChart(event: any) {
    console.log('HomePage::onClickChart::event: ' + event)
    event.preventDefault();
    // this.chartStandardView = !this.chartStandardView
  }

}
