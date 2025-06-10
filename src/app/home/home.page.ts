import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { UsuarioService } from '../services/usuario.service';
// import { DdbService } from '../services/ddb.service';
import { MapInput, Region, RegionType } from '../components/map-component/map-input';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CODES, Indicator, INDICATORS, NETWORKS, NETWORS_BY_STATE_PAYER, PAYERS, PAYERS_BY_STATE, TAXONOMY } from '../services/data-i';
import { StatesService } from '../services/states/states.service';
import { ColumnData } from '../services/county-data/county-data-i';
import { UtilsService } from '../services/utils.service';
import { BoxPlotComponent } from '../components/box-plot/box-plot.component';
import { Indicators } from '../components/score-table/score-indicators-i';
import { DataMixService } from '../services/data-mix.service';
import { AuthService } from '../services/auth.service';
import { EmailsService } from '../services/emails/emails.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild(BoxPlotComponent) boxPlotComponent!: BoxPlotComponent;
  Number: any;

  updateReference(value: number) {
    if (this.boxPlotComponent) {
      this.boxPlotComponent.updateReferenceLine(value);
    }
  }

  isCoaba: boolean = false

  isLocked: boolean = false

  myRate: number | null = null;

  isPopulationChecked: boolean = false;

  isCntEntitiesChecked: boolean = false;

  selectedPalette: string = 'camber'; // Default palette

  palettes: any = []

  indicatorGroups: Indicators;

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
    medicaidList: true,
    commercialList: true,
    generalList: true
  };

  toggleList(listName: 'medicaidList' | 'ratesList' | 'commercialList' | 'generalList'): void {
    if (!this.isListOpen[listName]) {
      this.isListOpen['medicaidList'] = true
      this.isListOpen['ratesList'] = true
      this.isListOpen['commercialList'] = true
      this.isListOpen['generalList'] = true
      this.isListOpen[listName] = true
    }
  }

  mapInput: MapInput;

  constructor(
    private toastController: ToastController,
    private route: ActivatedRoute,
    private statesSrv: StatesService,
    public usuarioSrv: UsuarioService,
    public dataMix: DataMixService,
    public utilsService: UtilsService,
    public authSrv: AuthService,
    private navCtrl: NavController,
    private router: Router,
    private emailSrv: EmailsService
  ) {
    this.palettes = utilsService.palettes
    this.updateColumnsInfo();
    this.selectedColumn = this.indicators[0]
    this.updateInfo()

    this.mapInput = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], 'mono', false);
    this.indicatorGroups = { region: '', subRegion: '', columns: [] }

    this.isCoaba = emailSrv.isEmailAuthorized(usuarioSrv.email)
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
    window.addEventListener('keydown', this.onKeyDown.bind(this));
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
      this.usuarioSrv.email.endsWith('peopleart.co') ||
      this.usuarioSrv.email === 'rupowell@7dbh.com' ||
      this.usuarioSrv.email === 'emilyiceaba@gmail.com' ||
      this.usuarioSrv.email === 'alexandra.tomei@bluesprigpediatrics.com') {

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
    // console.log("HomePage::updateInfo");
    if (this.selPayer === 'ZZ') { this.selNetwork = 'ZZ' }
    // console.log(this.selectedRegion)
    // console.log(this.selectedColumn)
    // console.log(this.selCode)
    // console.log(this.selPayer)
    // console.log(this.selTaxonomy)

    ////////// THIS CODE UPDATES THE MAP DATA ////////////////////////////////////////////////////////////////////////
    this.dataMix.getMapInputRatio(
      this.selectedRegion.type, this.selectedRegion.code, this.selectedColumn,
      this.selPayer, this.selNetwork, this.selTaxonomy, this.selBcbaBt, this.selCode, this.selectedPalette,
      this.myRate, this.isPopulationChecked, this.isCntEntitiesChecked).then(mi => {
        this.mapInput = mi
      }).then(() => {
        this.dataMix.updateIndicatorGroupData().then(() => {
          this.indicatorGroups = this.dataMix.getIndicatorGroups(this.selectedRegion, this.selectedRegion)
        })
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
    console.log('this.router.url: ', this.router.url)

    this.authSrv.signOut().then(() => {
      console.log('signed out!')
      this.navCtrl.navigateRoot('/authentication')
    });
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


  onRateChange(event: any) {
    console.log('HomePage::onRateChange: ', event.detail.value);
    this.myRate = parseFloat(event.detail.value);
    // Emit an event, call a function, or update something here

    this.updateReference(this.myRate)
    this.updateInfo()
  }

  getColor(value: number | null) {
    return this.utilsService.getColor((value !== null ? value / 100 : null), this.selectedPalette)
  }

  getType(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Number.isNaN(value)) return 'NaN';
    return typeof value;
  }

  onCheckboxChange(event: any) {
    console.log('Checkbox changed:', this.isPopulationChecked);
    this.isCntEntitiesChecked = false;
    this.updateInfo()
  }

  onCheckboxChangeCntEntities(event: any) {
    console.log('Checkbox onCheckboxChangeCntEntities:', this.isCntEntitiesChecked);
    this.isPopulationChecked = false;
    this.updateInfo()
  }

  onHoverOverMap(event: Region) {
    // console.log('HomePage::onHoverOverMap::', event);
    if (!this.isLocked) {
      this.indicatorGroups = this.dataMix.getIndicatorGroups(this.selectedRegion, event)
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'l' || event.key === 'L') {
      this.isLocked = !this.isLocked
    }
  }

  // Important: Don't forget to remove the listener when the component is destroyed
  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  onIndicatorChange(event: any) {
    console.log('HomePage::onIndicatorChange: ', event);
    const si = this.indicators.find(i => { return i.indicatorCode === event })
    console.log('HomePage::OUT::si: ', si);
    if (si) {
      console.log('HomePage::IN::si: ', si);
      this.selectedColumn = si
    }
    console.log('HomePage::this.selectedColumn: ', this.selectedColumn);
    this.updateInfo()
  }

}
