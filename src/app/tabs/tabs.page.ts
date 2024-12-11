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

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements AfterViewInit, OnInit {

  selectedRegion: Region = {
    type: RegionType.COUNTRY,
    name: 'USA',
    code: 'USA',
    codeFP: null
  }

  mapInput: MapInput;

  countiesVisible: boolean = true;
  ratesVisible: boolean = true;

  atLeaseOneSelected: boolean = false;

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

  columns: { stateId: string, colInfo: ColumnInfoByRegion, selected: boolean, format: string, pScale: number, pSymbol: string }[] = []

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
    private rateDs: RateDataService,
    private dataSrv: DataService,
    private entitiesSrv: EntitiesService
  ) {
    console.log('TabsPage::constructor')

    // This is the same as getStateInfo(region) but filtering out colums that are numeric
    const parms = [
      ...countyDataSrv.parameters,
      ...this.entitiesSrv.getStateInfo({ type: RegionType.COUNTRY, name: 'USA', code: 'USA', codeFP: '' })
    ]
    console.log('TabsPage::constructor::parms: ' + JSON.stringify(parms))

    this.columns = parms.map(column => {
      return { stateId: this.selectedRegion.code, colInfo: column, selected: true, ...this.getFormatFromFormat(column.format) }
    })

    console.log('TabsPage::constructor::this.columns: ' + JSON.stringify(this.columns))

    // this.selectedColumns = [this.columns[0], this.columns[1]]

    // this.columns[0].selected = true;
    // this.columns[1].selected = true;
    // this.columns[2].selected = true;
    this.atLeaseOneSelected = true;
    this.selectedColumn = this.columns[0]

    this.mapInput = dataSrv.getMapInput(RegionType.COUNTRY, "USA", this.selectedColumn.colInfo)

    // this.qChartData = this.getQChartDataFromSelectedCode(this.selectedCode, this.byPayer)
    this.qChartData = this.getQChartDataFromSelectedCodeSelectedNetworks(this.selectedCode,
      this.listOfSelectedNetworks.filter(sn => sn.selected).map(sn => sn.code))

    // console.log('TabsPage::constructor::this.qChartData: ' + JSON.stringify(this.qChartData))
  }

  isListOpen = {
    variablesList: true,
    secondList: false,
    thirdList: false
  };

  toggleList(listName: 'variablesList' | 'secondList' | 'thirdList'): void {
    this.isListOpen[listName] = !this.isListOpen[listName];
  }

  secondListItems = [
    { name: 'Item 1' },
    { name: 'Item 2' }
  ];

  thirdListItems = [
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
    this.qChartData = this.getQChartDataFromSelectedCodeSelectedNetworks(this.selectedCode,
      this.listOfSelectedNetworks.filter(sn => sn.selected).map(sn => sn.code))
  }


  getSelectedColumns() {
    return this.columns.filter(sc => sc.selected);
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
    this.selectedColumn = this.columns[1]
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
    this.selectedCountyFromChild = county;
    // this.countyDataSrv.countyInfo
    console.log('TabsPage::onSelectedCountyChange::Selected county from child: ', this.selectedCountyFromChild);
    this.calculateRanking();
    this.mapInput = this.dataSrv.getMapInput(RegionType.STATE, this.selectedCountyFromChild, this.selectedColumn.colInfo)
    // console.log('TabsPage::onSelectedCountyChange::mapInput: ' + JSON.stringify(this.mapInput))
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

    console.log('this.selectedColumns.length::' + this.columns.length)

    this.atLeaseOneSelected = this.columns.filter(c => c.selected).length > 0;
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
