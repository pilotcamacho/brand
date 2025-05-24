import { Component, OnInit, AfterViewInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
// import { ColumnData } from 'src/app/services/county-data/county-data-i';
// import { CountyDataSrvService } from 'src/app/services/county-data/county-data-srv.service';
// import { DataRowByCounty } from 'src/app/services/county-data/county-info';
import { GEOJSON_URLS, GEOJSON_MAP_SETTINGS } from './geojson-urls';
import { StatesService } from 'src/app/services/states/states.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MapInput, Region, RegionType } from './map-input';
import { GEODATA_COUNTIES } from './geodata-counties';
import { GEODATA_STATES } from './geodata-states';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss'],
  providers: [DecimalPipe],
  standalone: true,
})
export class MapComponentComponent implements AfterViewInit, OnChanges {

  @Input() mapInput!: MapInput;

  // Output property to send the selected country to the parent
  @Output() selectedCountyChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() hoverOverMap: EventEmitter<Region> = new EventEmitter<Region>();

  inUSAView: boolean = true;

  mapTitle: string = '';

  paletteId: string = 'cyan';



  private map!: L.Map;

  constructor(
    private statesSrv: StatesService,
    private utilsSrv: UtilsService,
    private decimalPipe: DecimalPipe
    // private cds: CountyDataSrvService
  ) {
    console.log('MapComponent::constructor:: ')
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('MapComponent::ngOnChanges')
    if (changes['mapInput']) {
      // console.log('MapComponentComponent::ngOnChanges::mapInput: ', this.mapInput);
      this.updateMap();
    }
  }

  ngAfterViewInit(): void {
    // console.log('MapComponent::ngAfterViewInit')
    this.updateMap()
    // this.addCaliforniaCounties(this.cds., this.cds);
    // this.map.invalidateSize();
  }

  updateMap() {
    // console.log('MapComponent::updateMap')
    this.mapTitle = this.mapInput.title
    if (this.map !== undefined) {
      // console.log('MapComponent::updateMap::this.map: ' + this.map)
      this.map.remove()
    }
    this.initMap();
    // console.log('MapComponent::updateMap::A')

    this.addMapElements(this.mapInput, this.utilsSrv);
    // console.log('MapComponent::updateMap::B')

  }

  // private clearMap(): void {
  //   console.log('MapComponentComponent::clearMap::this.map: ' + this.map)
  //   // this.cds.updateCountiesData(this.stateId)

  //   this.initMap();

  // }

  // Example method to change the selected county and emit the event
  changeCounty(county: string): void {
    console.log('MapComponentComponent::changeCounty::' + county + " - " + this.inUSAView)
    if (this.inUSAView) {
      // this.inUSAView = false;
      this.selectedCountyChange.emit(county);  // Emit the selected country
      // Emit event to Caller and then, with the data updated will update the mapl

      // const details = this.statesSrv.getStateDetailsByName(county);
      // if (details) {
      //   console.log(`State Code: ${details.state_code}, State FP: ${details.state_fp}`);
      //   this.updateMap();
      // } else {
      //   console.log('State not found!');
      // }

    }
  }

  private initMap(): void {

    this.inUSAView = this.mapInput.region.code === 'USA';

    // console.log('MapComponent::initMap::A')

    const coorJson = GEOJSON_MAP_SETTINGS[this.mapInput.region.code].coordinates
    const zoomJson = GEOJSON_MAP_SETTINGS[this.mapInput.region.code].zoom
    // console.log('MapComponent::initMap::B')

    this.map = L.map('map').setView(coorJson, zoomJson);
    // console.log('MapComponent::initMap::C')

    // NO INTERNET
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    console.log('MapComponent::initMap::D')

    this.addTitle(this.mapTitle);
    // this.addColorScaleLegend(-1.0, 1.0, 2);
    const [minV, maxV, format] = this.mapInput.min_max_format_values()
    // this.isRedGreen = this.mapInput.isRedGreen
    let decimals = 0
    if (format === "0.00%") {
      decimals = 2
    }

    this.addColorScaleLegend(minV, maxV, decimals, this.mapInput.paletteId);
    // console.log('MapComponent::initMap::E')

  }


  private addMapElements(mapInput: MapInput, us: UtilsService): void {
    // console.log("MapComponentComponent::addMapElements:: mapInput: " + JSON.stringify(mapInput))
    // console.log("MapComponentComponent::addMapElements:: this.stateId: " + this.mapInput.region.code)

    let data: { "features": any[] } = { "features": [] }
    if (GEOJSON_URLS[this.mapInput.region.code] === 'assets/geojson/us-states.json') {
      data = GEODATA_STATES
    } else {
      data = GEODATA_COUNTIES
    }

    // fetch(GEOJSON_URLS[this.mapInput.region.code])
    //   .then(response => {
    //     if (!response.ok) { // Check if the response status indicates an error
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json()
    //       .catch(error => { // Catch parsing errors specifically
    //         console.error("Failed to parse JSON error:", error);
    //         console.error("Failed to parse JSON text:", response.text);
    //         throw new Error("Invalid JSON response");
    //       });
    //   })
    //   .then(data => {
    //     console.log("MapComponentComponent::addMapElements::data: " + data)
    //     console.log("MapComponentComponent::addMapElements::JSON.stringify(data): " + JSON.stringify(data))

    let filteredData = data.features.filter((feature: any) => feature.properties.STATEFP === this.mapInput.region.codeFP);
    if (filteredData.length == 0) {
      filteredData = data.features
    }
    // console.log("MapComponentComponent::addMapElements::filteredData: " + JSON.stringify(filteredData))

    L.geoJSON(filteredData, {
      onEachFeature: this.createOnEachFeature(mapInput),
      // style: {
      //   color: 'blue',
      //   weight: 2,
      //   opacity: 0.65
      // }
      style: function (feature) {
        // console.log(feature)
        var color = "#ff7800"
        var opacity = 0.7
        var fillOpacity = 0.9; // Ensures solid color
        var borderColor = "#ffffff"; // White border color
        var borderWeight = 0.5; // Thin border
        var valor: [number | null, number | null, string, boolean, string] = [null, null, '', false, '']
        // console.log('MapComponent::style::feature: ' + feature?.properties.NAME)
        if (feature) {
          valor = mapInput.valuesFromSubRegionName(feature.properties.NAME)
          if (feature.properties.NAME === 'Washington') {
            // console.log('--->>>   MapComponent::style::valor::Washington: mapInput.' + JSON.stringify(mapInput))
            // console.log('--->>>   MapComponent::style::valor::Washington: valor.' + valor)
          }
          // console.log('MapComponent::style::valor: ' + valor)
        }
        // console.log('MapComponent::valor:: ' + valor)
        return {
          color: borderColor,
          fillColor: us.getColor(valor[0], mapInput.paletteId),
          weight: borderWeight,
          opacity: opacity,
          fillOpacity: fillOpacity
        };
      }
    }).addTo(this.map);
    // })
    // .then(r => {
    //   setTimeout(() => {
    //     this.map.invalidateSize();
    //   }, 300);
    // })
    // .catch(error => {
    //   console.error("Error fetching or parsing data:", error);
    // });

    // Trigger the resize event to ensure the map size is correct
    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }

  private addTitle(title: string): void {
    console.log('MapComponent::addTitle')
    const TitleControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: () => {
        const div = L.DomUtil.create('div', 'map-title');
        div.innerHTML = '<h3>' + title + '</h3>';
        return div;
      }
    });
    this.map.addControl(new TitleControl());
  }

  private addColorScaleLegend(minV: number | null, maxV: number | null, decimals: number, palette_id: string): void {
    const LegendControl = L.Control.extend({
      options: { position: 'bottomright' },
      onAdd: () => {
        const div = L.DomUtil.create('div', 'info legend');

        // Calculate the midpoint
        const midpoint = minV === null || maxV === null ? 'NA' : (minV + maxV) / 2;

        // Use Intl.NumberFormat to format with 2 decimals and a thousands separator
        const numberFormat = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });

        const formattedMinV = minV === null ? 'NA' : numberFormat.format(minV);
        const formattedMidpoint = midpoint === 'NA' ? midpoint : numberFormat.format(midpoint);
        const formattedMaxV = maxV === null ? 'NA' : numberFormat.format(maxV);


        // Set up the gradient and label structure
        div.innerHTML = `
          <div style="
            background: linear-gradient(to right, ${this.utilsSrv.getColor(0, palette_id)}, ${this.utilsSrv.getColor(0.5, palette_id)}, ${this.utilsSrv.getColor(1, palette_id)});
            width: 100px;
            height: 15px;
            border-radius: 5px;
            margin-bottom: 5px;
          "></div>
          <div style="display: flex; justify-content: space-between;">
          <span>${formattedMinV}</span>

          <span>${formattedMaxV}</span>
          </div>
        `;

        return div;
      }
    });

    this.map.addControl(new LegendControl());
  }

  // private addColorScaleLegend(): void {
  //   const LegendControl = L.Control.extend({
  //     options: { position: 'bottomright' },
  //     onAdd: () => {
  //       const div = L.DomUtil.create('div', 'info legend');
  //       const grades = [0, 0.25, 0.5, 0.75, 1.0]; // Define the scale intervals
  //       const labels = grades.map(grade => {
  //         const color = getColorFromRedToGreen(grade);
  //         return `<i style="background:${color}"></i> ${grade}`;
  //       });
  //       div.innerHTML = labels.join('<br>');
  //       return div;
  //     }
  //   });
  //   this.map.addControl(new LegendControl());
  // }

  // Event handler for click on a county
  private onCountyClick(event: { target: any; }): void {
    const layer = event.target;
    const countyName = layer.feature.properties.NAME;  // Adjust 'name' based on your GeoJSON structure
    console.log(`County clicked: ${countyName}`);
    this.changeCounty(countyName);


    // this.clearMap(this.mapInput.code);
    // Optionally, change style on click or do something else
    // layer.setStyle({
    //   weight: 5,
    //   color: '#666',
    //   fillOpacity: 0.9
    // });

    // Zoom to the clicked county
    // console.log('this: ' + (typeof this))
    // console.log('this.map: ' + this.map);
    // this.map.fitBounds(layer.getBounds());
  }

  // Function to define what happens on each feature
  createOnEachFeature(mapInput: MapInput) {
    return (feature: { properties: { NAME: any; popupContent: any; }; }, layer: any) => {
      // Bind a tooltip to the feature
      if (feature.properties && feature.properties.NAME) {
        // layer.bindTooltip(feature.properties.name + ": " + formatNumber(cds.val_norm_from_string(feature.properties.name, c)[1], '#.00'));
        const values = mapInput.valuesFromSubRegionName(feature.properties.NAME)
        // layer.bindTooltip(feature.properties.NAME + ": " + (values[1] === null ? 'NA' : this.utilsSrv.formatNumber(values[1], values[2])));
        layer.bindTooltip(feature.properties.NAME + ": " + (values[1] === null ? 'NA' : 
          this.decimalPipe.transform(values[1], values[2])
      ));


        
        // layer.on('click', function (e: any) {
        //   console.log('County clicked: ' + feature.properties.name);
        //   // Optionally, change style on click or do something else
        //   layer.setStyle({
        //     weight: 5,
        //     color: 'blue',
        //     fillOpacity: 0.4
        //   });

        //   // Zoom to the clicked county
        //   // this.map.fitBounds(layer.getBounds());ll
        // });
        layer.on({
          click: (e: { target: any; }) => this.onCountyClick(e),
          mouseover: (e: { target: any; }) => {
            const layer = e.target;
            layer.setStyle({
              weight: 3,
              color: '#666',
              fillOpacity: 0.7
            });
            const countyName = feature.properties.NAME;
            const thisSubRegion: Region = { name: countyName, type: this.inUSAView ? RegionType.STATE : RegionType.COUNTY, code: '', codeFP: '' }
            this.hoverOverMap.emit(thisSubRegion);  // Emit the hover event with the county name
          },
          mouseout: (e: { target: any; }) => {
            const layer = e.target;
            layer.setStyle({
              weight: 0.5,
              color: '#ffffff',
              fillOpacity: 0.9
            });
          }
        });
      }

      // Bind a popup to the feature
      if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
      }
    }
  }

}
