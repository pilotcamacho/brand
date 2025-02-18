import { AfterViewInit, Component, OnInit } from '@angular/core';

import { signOut } from 'aws-amplify/auth'

import { UsuarioService } from '../services/usuario.service';
import { DdbService } from '../services/ddb.service';
import { MapInput, Region, RegionType } from '../components/map-component/map-input';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CODES, Indicator, INDICATORS, NETWORKS, PAYORS } from '../services/data-i';
import { StatesService } from '../services/states/states.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnInit {

  //////////  DATA //////////////////////////////////////////////////////////////////////

  regionUSA: Region = {
    type: RegionType.COUNTRY,
    name: 'USA',
    code: 'USA',
    codeFP: null
  }

  // List of payors
  payors = PAYORS;

  // List of payors
  networks = NETWORKS;

  // List of codes
  codes = CODES;

  indicators = INDICATORS;

  columns: { name: any, prop: any, sortable: boolean }[] = [];
 

  //////////  PAGE COMPONENTS  //////////////////////////////////////////////////////////////////////

  columnsMedicaid: Indicator[] = []
  columnsRates: Indicator[] = []
  columnsCommercial: Indicator[] = []
  columnsGeneral: Indicator[] = []


  //////////  PAGE STATE  //////////////////////////////////////////////////////////////////////

  selectedRegion: Region = this.regionUSA;

  selectedColumn!: Indicator; //{ stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string };

  selPayor: string = 'ZZ';

  selNetwork: string = 'ZZ'

  selCode: string = '00000';


  //////////  PAGE VIEW  //////////////////////////////////////////////////////////////////////

  countiesVisible: boolean = true;

  chartStandardView = false;

  isListOpen = {
    ratesList: true,
    medicaidList: false,
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
    private statesSrv: StatesService,
    public usuarioSrv: UsuarioService,
    public dynamoDB: DdbService
  ) {
    this.updateColumnsInfo();
    this.selectedColumn = this.indicators[0]
    this.updateInfo()
    this.mapInput = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], true, '0');
    this.dynamoDB.getMapInput(RegionType.COUNTRY, 'USA', this.selectedColumn, '06', 'ZZ', this.selCode)
      .then(mi => { this.mapInput = mi })
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
    // this.updateColumnsInfo({ type: RegionType.COUNTRY, name: 'USA', code: 'USA', codeFP: '' });
    // this.updateColumnsInfo();

    this.selectedRegion = this.regionUSA
    this.updateInfo()
    this.onClickChart(event)
    // this.updateInfo()
  }

  onClickChart(event: any) {
    console.log('HomePage::onClickChart::event: ' + event)
    event.preventDefault();
    // this.chartStandardView = !this.chartStandardView
  }

  selectedCountyFromChild: string = '';  // To store the value received from the child

  onRadioChange() {
    console.log('HomePage::onRadioChange::')
    this.updateInfo()
  }

  onSelectedCountyChange(county: any): void {
    // This method is called by the map.
    console.log('HomePage::onSelectedCountyChange::county: ' + county)

    if (this.usuarioSrv.email.endsWith('juniperplatform.com')) {

      this.selectedCountyFromChild = county;

      console.log('HomePage::onSelectedCountyChange::Selected county from child: ', this.selectedCountyFromChild);

      const out = this.statesSrv.getStateDetailsByName(county)

      if (out !== null) {
        this.selectedRegion = {
          type: RegionType.STATE, name: county, code: out.state_code, codeFP: out.state_fp
        };
      }

    } else {
      this.showErrorMessage('Available only for Juniper users.')
    }
    this.updateInfo()
  }

  // onClickChart(event: any) {
  //   console.log('HomePage::onClickChart::event: ' + event)
  //   event.preventDefault();
  //   // this.chartStandardView = !this.chartStandardView
  // }

  onCodeChange(event: any) {
    console.log("HomePage::onCodeChange::", event.detail.value);
    this.updateInfo()
  }

  onPayorChange(event: any) {
    console.log("HomePage::onPayorChange::", event.detail.value);
    this.updateInfo()
  }

  updateInfo() {
    console.log("HomePage::updateInfo");
    if (this.selPayor === 'ZZ') { this.selNetwork = 'ZZ' }
    console.log(this.selectedRegion)
    console.log(this.selectedColumn)
    console.log(this.selCode)
    console.log(this.selPayor)
    this.dynamoDB.getMapInput(
      this.selectedRegion.type, this.selectedRegion.code, this.selectedColumn, this.selPayor, this.selNetwork, this.selCode)
      .then(mi => {
        this.mapInput = mi
        this.columns = [
          { name: this.mapInput?.region?.type === 'country' ? 'State' : 'County', prop: 'subRegion', sortable: true },
          { name: 'Q10', prop: 'quantiles.q10', sortable: true },
          { name: 'Q25', prop: 'quantiles.q25', sortable: true },
          { name: 'Q50', prop: 'quantiles.q50', sortable: true },
          { name: 'Q75', prop: 'quantiles.q75', sortable: true },
          { name: 'Q90', prop: 'quantiles.q90', sortable: true },
          { name: 'Change', prop: 'quantiles.change', sortable: true }
        ]
      })
    this.updateColumnsInfo()
  }


  // updateColumnsInfo(countyInfo: { type: RegionType, name: string, code: string, codeFP: string }) {
  updateColumnsInfo() {
    this.columnsMedicaid = this.indicators.filter(col => (col.indicatorGroup === 'medicare'))
    this.columnsRates = this.indicators.filter(col => (col.indicatorGroup === 'rates'))
    this.columnsCommercial = this.indicators.filter(col => (col.indicatorGroup === 'commercial'))
    this.columnsGeneral = this.indicators.filter(col => (col.indicatorGroup === 'general'))
    this.networks = NETWORKS.filter(n => {
      return ((n.pId === this.selPayor && this.selPayor !== 'ZZ') || this.selPayor === 'ZZ' || n.id === 'ZZ')
    })
  }


  signOut() {
    console.log('about to signOut ....')
    signOut().then(() => console.log('signed out!'));
  }

  async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }

}
