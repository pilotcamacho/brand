import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ColumnInfoByRegion } from '../services/county-data/column-info';
import { CountyDataSrvService } from '../services/county-data/county-data-srv.service';
import { RateDataService } from '../services/rate-data/rate-data.service';
import { CodeData } from '../services/rate-data/rate-data-i';
import { qChartComponentDataI } from '../components/q-chart/q-chart.component-data-i';
import { numberNull } from '../services/rate-data/rate-data';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { MapInput, Region, RegionType } from '../components/map-component/map-input';
import { EntitiesService } from '../services/entities/entities.service';
// import { CountyInfo } from '../services/county-data/county-info';
import { getCurrentUser, signOut } from 'aws-amplify/auth'
import { StatesService } from '../services/states/states.service';
import { UsuarioService } from '../services/usuario.service';
import { DdbService } from '../services/ddb.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements AfterViewInit, OnInit {

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

  // Selected values
  selPayor: string | undefined = '7218e478-2e12-4993-a492-fd1c2358b24e';
  selCode: string | undefined = '97151';

  selectedRegion: Region = {
    type: RegionType.COUNTRY,
    name: 'USA',
    code: 'USA',
    codeFP: null
  }

  mapInput: MapInput;

  countiesVisible: boolean = true;
  ratesVisible: boolean = true;

  atLeastOneSelected: boolean = false;

  // mapStandardView = true;
  chartStandardView = true;

  selectedCountyFromChild: string = '';  // To store the value received from the child
  // selectedCounty!: CountyInfo;

  countyRanking: number = 0;

  isModalOpen = false;

  format: string = '1.0'
  pScale = 1;
  pSymbol = ''

  // selectedTab: string = 'map';  // Default selected tab

  columnsMedicaid: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }[] = []
  columnsRates: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }[] = []
  columnsCommercial: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }[] = []
  columnsGeneral: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }[] = []

  // selectedColumns: { colInfo: ColumnInfo, selected: boolean, format: string, pScale: number, pSymbol: string }[] = [];
  selectedColumn!: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string };

  byPayer: boolean = false;
  selectedCode: CodeData = this.rateDs.rate_codes[0];
  listOfCodes: CodeData[] = this.rateDs.rate_codes;

  listOfNetworks: string[] = this.rateDs.getNetworks();

  listOfSelectedNetworks: { code: string, selected: boolean }[] = this.rateDs.getNetworks().map(sn => { return { code: sn, selected: true } });

  qChartData: qChartComponentDataI = this.getQChartDataFromSelectedCode(this.selectedCode, this.byPayer)


  constructor(
    private toastController: ToastController,
    private route: ActivatedRoute,
    private countyDataSrv: CountyDataSrvService,
    private statesSrv: StatesService,
    private rateDs: RateDataService,
    private dataSrv: DataService,
    private entitiesSrv: EntitiesService,
    public usuarioSrv: UsuarioService,
    public dynamoDB: DdbService
  ) {
    console.log('TabsPage::constructor')

    dynamoDB.go('rate', 'AK', '06', 'ZZ', 'ZZ', 3).then(dataRead => {
      console.log(`TabsPage::constructor::dataRead: ${JSON.stringify(dataRead)}`)
    })


    this.updateColumnsInfo({ type: RegionType.COUNTRY, name: 'USA', code: 'USA', codeFP: '' })

    // this.selectedColumns = [this.columns[0], this.columns[1]]

    // this.columns[0].selected = true;
    // this.columns[1].selected = true;
    // this.columns[2].selected = true;
    this.atLeastOneSelected = true;
    this.selectedColumn = this.columnsMedicaid[0]

    this.mapInput = dataSrv.getMapInput(RegionType.COUNTRY, "USA", this.selectedColumn.colInfo)

    // this.qChartData = this.getQChartDataFromSelectedCode(this.selectedCode, this.byPayer)
    this.qChartData = this.getQChartDataFromSelectedCodeSelectedNetworks(this.selectedCode,
      this.listOfSelectedNetworks.filter(sn => sn.selected).map(sn => sn.code))

    // console.log('TabsPage::constructor::this.qChartData: ' + JSON.stringify(this.qChartData))
  }

  updateColumnsInfo(countyInfo: { type: RegionType, name: string, code: string, codeFP: string }) {

    const previousSelectionCode: string = this.selectedColumn?.colInfo?.code ?? "NA";

    console.log(`TabsPage::updateColumnsInfo::type|name|code|codeFP: ${countyInfo.type}, ${countyInfo.name}, ${countyInfo.code}`)

    const region: Region = {
      type: countyInfo.type,
      name: countyInfo.name,
      code: countyInfo.code,
      codeFP: countyInfo.codeFP
    }
    // This is the same as getStateInfo(region) but filtering out colums that are numeric
    const parms = [
      ...this.countyDataSrv.getParameters(region),
      ...this.entitiesSrv.getStateInfo(countyInfo)
    ]
    // console.log('TabsPage::constructor::parms: ' + JSON.stringify(parms))


    this.columnsMedicaid = parms.filter(col => (col.columnGroup === 'medicare')).map(column => {
      return { stateId: this.selectedRegion.code, colInfo: column, selected: true, ...this.getFormatFromFormat(column.format) }
    })

    this.columnsRates = parms.filter(col => (col.columnGroup === 'rates')).map(column => {
      return { stateId: this.selectedRegion.code, colInfo: column, selected: true, ...this.getFormatFromFormat(column.format) }
    })

    this.columnsCommercial = parms.filter(col => (col.columnGroup === 'commercial')).map(column => {
      return { stateId: this.selectedRegion.code, colInfo: column, selected: true, ...this.getFormatFromFormat(column.format) }
    })

    this.columnsGeneral = parms.filter(col => (col.columnGroup === 'general')).map(column => {
      return { stateId: this.selectedRegion.code, colInfo: column, selected: true, ...this.getFormatFromFormat(column.format) }
    })


    // console.log('TabsPage::constructor::this.columnsMedicaid: ' + JSON.stringify(this.columnsMedicaid))
    console.log('TabsPage::constructor::this.columnsCommercial: ' + JSON.stringify(this.columnsCommercial))
    // console.log('TabsPage::constructor::this.columnsGeneral: ' + JSON.stringify(this.columnsGeneral))


    console.log(`TabsPage::updateColumnsInfo::previousSelectionCode: ${previousSelectionCode}`)

    if (previousSelectionCode === "NA") {
      this.selectedColumn = this.columnsMedicaid[1]
    } else {

      const theSelectionMedicaid = this.columnsMedicaid.filter(c => c.colInfo.code === previousSelectionCode)
      const theSelectionRates = this.columnsRates.filter(c => c.colInfo.code === previousSelectionCode)
      const theSelectionCommercial = this.columnsCommercial.filter(c => c.colInfo.code === previousSelectionCode)
      const theSelectionGeneral = this.columnsGeneral.filter(c => c.colInfo.code === previousSelectionCode)

      console.log(`TabsPage::updateColumnsInfo::theSelection: ${JSON.stringify(theSelectionMedicaid)}`)


      this.selectedColumn = [...theSelectionMedicaid, ...theSelectionRates, ...theSelectionCommercial, ...theSelectionGeneral][0]

      console.log(`TabsPage::updateColumnsInfo::selectedColumn: ${JSON.stringify(this.selectedColumn)}`)


    }



  }

  signOut() {
    console.log('about to signOut ....')
    signOut().then(() => console.log('signed out!'));
  }

  isListOpen = {
    medicaidList: true,
    ratesList: false,
    commercialList: false,
    generalList: false
  };

  toggleList(listName: 'medicaidList' | 'ratesList' | 'commercialList' | 'generalList'): void {
    this.isListOpen[listName] = !this.isListOpen[listName];
  }

  commercialListItems = [
    { name: 'Item 1' },
    { name: 'Item 2' }
  ];

  generalListItems = [
    { name: 'Item A' },
    { name: 'Item B' }
  ];

  ngOnInit() {
    console.log('TabsPage::ngOnInit');
    const stateId = this.route.snapshot.paramMap.get('stateId');
    console.log('TabsPage::ngOnInit::stateId: ' + stateId)
  }

  onClickMapa(event: any) {
    console.log('TabsPage::onClickMapaGrande')
    this.updateColumnsInfo({ type: RegionType.COUNTRY, name: 'USA', code: 'USA', codeFP: '' });
    this.mapInput = this.dataSrv.getMapInput(RegionType.COUNTRY, "USA", this.selectedColumn.colInfo)
    this.onClickChart(event)
  }

  onClickChart(event: any) {
    console.log('TabsPage::onClickChart::event: ' + event)
    event.preventDefault();
    // this.chartStandardView = !this.chartStandardView
  }

  // Method triggered on hover
  onHover(option: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }) {
    console.log("Hovered over:", option.colInfo.code);
    console.log("type over:", typeof option);
    if (option.colInfo.code != this.selectedColumn.colInfo.code) {
      this.selectedColumn = option
    }
    // You can add any other action you want when hovering here
  }

  onRadioChange() {
    console.log('TabsPage::onRadioChange::')
    this.mapInput = this.dataSrv.getMapInput(this.mapInput.region.type, this.mapInput.region.name, this.selectedColumn.colInfo)
    console.log(`TabsPage::onRadioChange::this.mapInput: ${JSON.stringify(this.mapInput)}`)
    this.qChartData = this.getQChartDataFromSelectedCodeSelectedNetworks(this.selectedCode,
      this.listOfSelectedNetworks.filter(sn => sn.selected).map(sn => sn.code))
  }


  getSelectedColumns() {
    return this.columnsMedicaid.filter(sc => sc.selected);
  }

  getQChartDataFromSelectedCode(selectedCode: CodeData, byPayer: boolean): qChartComponentDataI {
    const codeIdx = this.listOfCodes.findIndex(rateCode => rateCode === selectedCode);
    console.log('TabsPage::getQChartDataFromSelectedCode::codeIdx: ' + codeIdx)


    const theData: [numberNull, numberNull, numberNull, numberNull, numberNull, numberNull, numberNull][]
      = JSON.parse(JSON.stringify(this.rateDs.rate_data[codeIdx]));

    if (!byPayer) {

      return {
        lables: this.rateDs.getNetworks(),
        data: theData
      }
    } else {

      const idxPayers = this.rateDs.getIdxForPayers();
      const thePayersData = theData.filter((_, index) => idxPayers.includes(index));

      return {
        lables: this.rateDs.getPayers(),
        data: thePayersData
      }
    }
  }


  getQChartDataFromSelectedCodeSelectedNetworks(selectedCode: CodeData, lSelNetworks: string[]): qChartComponentDataI {
    const codeIdx = this.listOfCodes.findIndex(rateCode => rateCode === selectedCode);
    console.log('TabsPage::getQChartDataFromSelectedCodeSelectedNetworks::codeIdx: ' + codeIdx)

    const theData: [numberNull, numberNull, numberNull, numberNull, numberNull, numberNull, numberNull][]
      = JSON.parse(JSON.stringify(this.rateDs.rate_data[codeIdx]));

    const indices = this.listOfSelectedNetworks.filter(sn => sn.selected).map(element => this.rateDs.getNetworks().indexOf(element.code));

    return {
      lables: indices.map(idx => this.rateDs.getNetworks()[idx]),
      data: indices.map(idx => theData[idx])
    }
  }

  ngAfterViewInit() {
    // Code to run after the page is fully loaded
    this.selectedColumn = this.columnsMedicaid[1]
    console.log('TabsPage::ngAfterViewInit::Page fully loaded and view initialized');
    // this.selectedColumn = this.columns[0]
  }

  handleChangeSelection() {
    console.log('TabsPage::Selection was changed.');
    console.log("this.selectedColumn.format:::" + this.selectedColumn.colInfo.format)

  }

  // This method will be called whenever the selected column changes
  onColumnChange(event: any) {
    console.log('TabsPage::onColumnChange::Selection was changed.');

    console.log('Selected column:', event.detail.value);
    // You can now handle the new selected value
    this.selectedColumn = event.detail.value;
    console.log("this.selectedColumn.format:::" + JSON.stringify(this.selectedColumn.colInfo.format))

    // Do any additional actions based on the selected column
  }

  getFormatFromFormat(f: string): { format: string, pScale: number, pSymbol: string } {
    var out = { format: '1.0-0', pScale: 1, pSymbol: '' }
    if (f == '0.00%') {
      out = { format: '1.2-2', pScale: 100, pSymbol: '%' }
    } else if (f == '0.00') {
      out = { format: '1.2-2', pScale: 1, pSymbol: '' }
    } else if (f == '0') {
      out = { format: '1.0-0', pScale: 1, pSymbol: '' }
    }
    return out;
  }

  onCodeChange(event: any) {
    const isChecked = event.detail.checked;
    console.log('Code changed:', event.detail.value);
    this.selectedCode = event.detail.value
    // this.qChartData = this.getQChartDataFromSelectedCode(this.selectedCode, this.byPayer)
    this.qChartData = this.getQChartDataFromSelectedCodeSelectedNetworks(this.selectedCode,
      this.listOfSelectedNetworks.filter(sn => sn.selected).map(sn => sn.code))
    // console.log('TabsPage::onCodeChange::this.qChartData: ' + JSON.stringify(this.qChartData))
  }

  onNetworkSelected(event: any) {
    console.log('TabsPage::onNetworChange::Selection was changed::' + JSON.stringify(this.listOfSelectedNetworks.filter(sn => sn.selected)));
    this.qChartData = this.getQChartDataFromSelectedCodeSelectedNetworks(this.selectedCode,
      this.listOfSelectedNetworks.filter(sn => sn.selected).map(sn => sn.code))


    // const isChecked = event.detail.checked;
    // console.log('Code changed:', event.detail.value);
    // this.selectedCode = event.detail.value
    // this.qChartData = this.getQChartDataFromSelectedCode(this.selectedCode, this.byPayer)
    // console.log('TabsPage::onCodeChange::this.qChartData: ' + JSON.stringify(this.qChartData))
  }

  // Method to open the modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


  // Method to handle the modal dismiss
  onModalDismiss() {
    console.log('Modal is about to be dismissed');

    // Perform any cleanup or state resetting needed
    this.isModalOpen = false;  // Ensure the modal state is correctly reset
  }

  // Method to handle the toggle change event
  onToggleChange(event: any) {
    // Get the new value from the event
    const newValue = event.detail.checked;

    // Log or handle the new value
    console.log('Toggled value:', newValue);
    this.byPayer = newValue;
    this.qChartData = this.getQChartDataFromSelectedCode(this.selectedCode, this.byPayer)
  }


  // Method to capture the selected country value emitted from the child component
  onSelectedCountyChange(county: any): void {

    if (this.usuarioSrv.email.endsWith('juniperplatform.com')) {

      this.selectedCountyFromChild = county;
      // this.countyDataSrv.countyInfo
      console.log('TabsPage::onSelectedCountyChange::Selected county from child: ', this.selectedCountyFromChild);

      const out = this.statesSrv.getStateDetailsByName(county)

      if (out !== null) {
        this.calculateRanking();
        const countyInfo: { type: RegionType, name: string, code: string, codeFP: string } = {
          type: RegionType.STATE, name: county, code: out.state_code, codeFP: out.state_fp
        };
        this.updateColumnsInfo(countyInfo);
      }


      this.mapInput = this.dataSrv.getMapInput(RegionType.STATE, this.selectedCountyFromChild, this.selectedColumn.colInfo)
      // console.log('TabsPage::onSelectedCountyChange::mapInput: ' + JSON.stringify(this.mapInput))
    } else {
      this.showErrorMessage('Available only for Juniper users.')
    }
  }

  calculateRanking() {
    console.log('calculateRanking')
    // this.countyRanking = this.ds.getCountyRank(this.stateId, this.selectedCountyFromChild, this.selectedColumn.colInfo)
    console.log('this.countyRanking: ' + this.countyRanking)
  }

  onCheckboxChange(column: any) {
    console.log('Checkbox changed for:', column);
    // You can also access column.selected to see the new state
    console.log('Selected:', column.selected);

    console.log('this.selectedColumns.length::' + this.columnsMedicaid.length)

    this.atLeastOneSelected = this.columnsMedicaid.filter(c => c.selected).length > 0;
    // Additional logic can be added here
  }

  toggleCountyVisibility() {
    console.log('toggleCountyVisibility')
    this.countiesVisible = !this.countiesVisible;
    if (!this.countiesVisible) this.ratesVisible = true

  }

  toggleRateVisibility() {
    console.log('toggleRateVisibility')
    this.ratesVisible = !this.ratesVisible;
    if (!this.ratesVisible) this.countiesVisible = true
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
