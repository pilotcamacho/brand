import { AfterViewInit, Component, OnInit } from '@angular/core';

import { signOut } from 'aws-amplify/auth'

import { UsuarioService } from '../services/usuario.service';
import { DdbService } from '../services/ddb.service';
import { MapInput, Region, RegionType } from '../components/map-component/map-input';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CODES, Indicator, INDICATORS, NETWORKS, NETWORS_BY_STATE_PAYER, PAYERS, PAYERS_BY_STATE, TAXONOMY } from '../services/data-i';
import { StatesService } from '../services/states/states.service';
import { ColumnData } from '../services/county-data/county-data-i';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnInit {

  selectedPalette: string = 'camber'; // Default palette

  palettes: any = []

  //////////  DATA //////////////////////////////////////////////////////////////////////

  regionUSA: Region = {
    type: RegionType.COUNTRY,
    name: 'USA',
    code: 'USA',
    codeFP: null
  }

  // List of payers
  payers = PAYERS;

  // List of payers
  networks = NETWORKS;

  // List of codes
  codes = CODES;

  // List of taxonomies
  taxonomies = TAXONOMY;

  indicators = INDICATORS;

  columns: { name: any, prop: any, sortable: boolean }[] = [];


  //////////  PAGE COMPONENTS  //////////////////////////////////////////////////////////////////////

  columnsMedicaid: Indicator[] = []
  columnsRates: Indicator[] = []
  columnsCommercial: Indicator[] = []
  columnsGeneral: Indicator[] = []

  boxPlotData: ColumnData = {
    code: 'state',
    name: 'bp',
    formula: 'bp',
    description: 'bp',
    type: 'bp',
    format: '0.0'
  }


  //////////  PAGE STATE  //////////////////////////////////////////////////////////////////////

  selectedRegion: Region = this.regionUSA;

  selectedColumn!: Indicator; //{ stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string };

  selPayer: string = 'ZZ';
  disableNetwork: boolean = true

  selNetwork: string = 'ZZ'

  selCode: string = '00000';

  selTaxonomy: string = 'ZZ';

  selBcbaBt: string = 'Z'

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
    public dynamoDB: DdbService,
    public utilsService: UtilsService
  ) {
    this.palettes = utilsService.palettes
    this.updateColumnsInfo();
    this.selectedColumn = this.indicators[0]
    this.updateInfo()
    this.mapInput = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], 'mono', '0');
    this.dynamoDB.getMapInput(RegionType.COUNTRY, 'USA', this.selectedColumn, '06', 'ZZ', 'ZZ', 'Z', this.selCode, 'mono')
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

    if (this.usuarioSrv.email.endsWith('juniperplatform.com') ||
      this.usuarioSrv.email.endsWith('intercaretherapy.com') ||
      this.usuarioSrv.email.endsWith('peopleart.co')) {

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

  onTaxonomyChange(event: any) {
    console.log("HomePage::onTaxonomyChange::", event.detail.value);
    this.updateInfo()
  }

  onPayerChange(p_i36: any) {
    console.log("HomePage::onPayerChange::", p_i36);
    if (p_i36 === '') p_i36 = 'ZZ'
    this.selPayer = p_i36
    this.resetSearchBoxNetworkComponent()
    this.updateInfo()
  }

  onNetworkChange(t_i36: any) {
    console.log("HomePage::onNetworkChange::", t_i36);
    if (t_i36 === '') t_i36 = 'ZZ'
    this.selNetwork = t_i36
    this.updateInfo()
  }

  updateInfo() {
    console.log("HomePage::updateInfo");
    if (this.selPayer === 'ZZ') { this.selNetwork = 'ZZ' }
    console.log(this.selectedRegion)
    console.log(this.selectedColumn)
    console.log(this.selCode)
    console.log(this.selPayer)
    console.log(this.selTaxonomy)
    this.dynamoDB.getMapInput(
      this.selectedRegion.type, this.selectedRegion.code, this.selectedColumn,
      this.selPayer, this.selNetwork, this.selTaxonomy, this.selBcbaBt, this.selCode, this.selectedPalette)
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
    this.payers = this.getListOfPayersByRegion(this.selectedRegion.code)

    // this.networks = NETWORKS.filter(n => {
    //   return ((n.pId === this.selPayer && this.selPayer !== 'ZZ') || this.selPayer === 'ZZ' || n.id === 'ZZ')
    // })

    // console.log("HomePage::updateColumnsInfo::this.selectedRegion.code: " + this.selectedRegion.code);
    // console.log("HomePage::updateColumnsInfo::this.selPayer: " + this.selPayer);

    const selectedIds = NETWORS_BY_STATE_PAYER.find(n => { return (n.state_id === this.selectedRegion.code && n.p_id36 === this.selPayer) })
    // console.log("HomePage::updateColumnsInfo::selectedIds: " + selectedIds);

    // Convert to Set for O(1) lookups
    const selectedIdsSet = new Set(selectedIds?.n);
    // console.log("HomePage::updateColumnsInfo::selectedIdsSet: " + selectedIdsSet);

    // Filter efficiently
    this.networks = NETWORKS.filter(network => {
      return ((selectedIdsSet.has(network.id) && this.selPayer !== 'ZZ') || this.selPayer === 'ZZ' || network.id === 'ZZ')
    });

  }

  getListOfPayersByRegion(region: string) {
    if (region === 'USA') return PAYERS;

    const statePayers = PAYERS_BY_STATE.find(payer => payer.state_id === region);

    return statePayers?.payers?.sort((a, b) => a.name.localeCompare(b.name)) ?? [];
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

  resetSearchBoxNetworkComponent() {
    this.disableNetwork = true
    setTimeout(() => this.disableNetwork = (this.selPayer === 'ZZ'), 100); // Reset the flag
  }
  // this.selPayer === 'ZZ'

  openLink(url: string) {
    window.open(url, '_blank');
  }

  applyColorPalette() {
    console.log("HomePage::applyColorPalette: " + this.selectedPalette);
    this.updateInfo()
  }
}
