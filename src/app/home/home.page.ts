import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

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
import { BoxPlotComponent } from '../components/box-plot/box-plot.component';
import { Indicators } from '../components/score-table/score-indicators-i';

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

  isLocked: boolean = false

  myRate: number | null = null;

  isPopulationChecked: boolean = false;

  isCntEntitiesChecked: boolean = false;

  selectedPalette: string = 'camber'; // Default palette

  palettes: any = []

  indicatorGroups: Indicators = {
    subRegion: 'USA',
    columns: [
      {
        col_title: 'Commercial', rows: [
          { code: '1', title: 'Rates', value: 134, pColor: 75 },
          { code: '2', title: 'Payers count', value: 24, pColor: 65 },
          { code: '3', title: 'Neworks count', value: 23, pColor: 45 },
          { code: '4', title: 'Entities count', value: 9, pColor: 25 }
        ]
      },
      {
        col_title: 'Medicaid', rows: [
          { code: '5', title: 'Rates', value: 134, pColor: 75 },
          { code: '6', title: 'Payers count', value: 24, pColor: 65 },
          { code: '7', title: 'Neworks count', value: 23, pColor: 45 },
          { code: '8', title: 'Entities count', value: 9, pColor: 25 }
        ]
      },
      {
        col_title: 'General', rows: [
          { code: '9', title: 'Rates', value: 134, pColor: 75 },
          { code: '10', title: 'Payers count', value: 24, pColor: 65 },
          { code: '11', title: 'Neworks count', value: 23, pColor: 45 },
          { code: '12', title: 'Entities count', value: 9, pColor: 25 }
        ]
      }
    ]
  }


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
  mapInputRegion: MapInput;
  mapInputPopulation: MapInput;
  mapInputCntEntities: MapInput;

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

    this.mapInputRegion = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], 'mono', '0');
    this.mapInputPopulation = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], 'mono', '0');
    this.mapInputCntEntities = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], 'mono', '0');
    this.mapInput = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], 'mono', '0');

    Promise.all([
      this.dynamoDB.getMapInput(RegionType.COUNTRY, 'USA', this.selectedColumn, '06', 'ZZ', 'ZZ', 'Z', this.selCode, 'mono', this.myRate),
      this.dynamoDB.getMapInput(RegionType.COUNTRY, 'USA', this.indicators[12], '06', 'ZZ', 'ZZ', 'Z', this.selCode, 'mono', this.myRate),
      this.dynamoDB.getMapInput(RegionType.COUNTRY, 'USA', this.indicators[3], '06', 'ZZ', 'ZZ', 'Z', this.selCode, 'mono', this.myRate)
    ]).then(([regionInput, populationInput, cntEntitiesInput]) => {
      this.mapInputRegion = regionInput;
      this.mapInputPopulation = populationInput;
      this.mapInputCntEntities = cntEntitiesInput;

      this.mapInput = new MapInput(
        this.mapInputRegion.region,
        this.mapInputRegion.title,
        this.mapInputRegion.data,
        this.mapInputRegion.paletteId,
        this.mapInputRegion.format
      );
    });
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
    Promise.all([
      this.dynamoDB.getMapInput(
        this.selectedRegion.type, this.selectedRegion.code, this.selectedColumn,
        this.selPayer, this.selNetwork, this.selTaxonomy, this.selBcbaBt, this.selCode, this.selectedPalette,
        this.myRate),

      this.dynamoDB.getMapInput(
        this.selectedRegion.type, this.selectedRegion.code, this.indicators[12],
        'ZZ', 'ZZ', 'ZZ', 'Z', '00000', this.selectedPalette,
        this.myRate),


      this.dynamoDB.getMapInput(
        this.selectedRegion.type, this.selectedRegion.code, this.indicators[3],
        'ZZ', 'ZZ', 'ZZ', 'Z', '00000', this.selectedPalette,
        this.myRate),

    ]).then(([mi, populationInput, cntEntities]) => {
      // this.mapInputRegion = regionInput;
      this.mapInputPopulation = populationInput;
      this.mapInputCntEntities = cntEntities;


      // console.log("HomePage::updateInfo::if (this.isPopulationChecked)::mi: " + JSON.stringify(mi));

      // console.log("HomePage::updateInfo::if (this.isPopulationChecked)::this.mapInputPopulation: " + JSON.stringify(this.mapInputPopulation));



      if (this.isPopulationChecked || this.isCntEntitiesChecked) {
        // Create a Map for fast lookup of population values by subRegion
        const populationMap = this.isPopulationChecked ?
          new Map(
            this.mapInputPopulation.data.map(dp => [dp.subRegion, dp.value])
          ) :
          new Map(
            this.mapInputCntEntities.data.map(dp => [dp.subRegion, dp.value])
          )
          ;

        // console.log("HomePage::updateInfo::if (this.isPopulationChecked)::populationMap: " + JSON.stringify(populationMap));

        // Divide each value in mi.data by the corresponding population value
        mi.data = mi.data.map(dp => {
          const populationValue = populationMap.get(dp.subRegion);

          // Avoid division by zero or undefined population values
          const newValue = (populationValue && populationValue !== 0)
            ? dp.value / populationValue
            : 0;

          return {
            ...dp,
            value: newValue
          };
        });


        const maxValue = Math.max(...mi.data.map(dp => { return dp.value }));
        // console.log("HomePage::updateInfo::maxValue: " + maxValue)

        const inverse = 1 / maxValue;
        // console.log("HomePage::updateInfo::inverse: " + inverse)


        // If maxValue > 1, cap roundE10 at 1
        const roundE10 = Math.max(1, this.roundToExponent10(inverse));
        // console.log("HomePage::updateInfo::roundE10: " + roundE10)


        mi.format = this.getFormatFromRound(roundE10);
        // console.log("HomePage::updateInfo:mi.format: " + mi.format)
      }

      this.mapInput = mi
      // this.columns = [
      //   { name: this.mapInput?.region?.type === 'country' ? 'State' : 'County', prop: 'subRegion', sortable: true },
      //   { name: 'Q10', prop: 'quantiles.q10', sortable: true },
      //   { name: 'Q25', prop: 'quantiles.q25', sortable: true },
      //   { name: 'Q50', prop: 'quantiles.q50', sortable: true },
      //   { name: 'Q75', prop: 'quantiles.q75', sortable: true },
      //   { name: 'Q90', prop: 'quantiles.q90', sortable: true },
      //   { name: 'Change', prop: 'quantiles.change', sortable: true },
      //   { name: 'My rate', prop: 'quantiles.myRate', sortable: true }
      // ]
    })
    this.updateColumnsInfo()
  }

  roundToExponent10(value: number): number {
    // Get the power of 10 just greater or equal to value
    const power = Math.ceil(Math.log10(value));
    return Math.pow(10, power);
  }

  getFormatFromRound(roundE10: number): string {
    if (roundE10 <= 1) return '0'; // no decimals
    const decimalPlaces = Math.abs(Math.log10(roundE10)) + 1;
    return '0.' + '0'.repeat(decimalPlaces);
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

  onHoverOverMap(event: any) {
    console.log('HomePage::onHoverOverMap::', event);
    if (!this.isLocked) {
      this.indicatorGroups['subRegion'] = event
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

}
