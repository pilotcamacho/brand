import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }




  formatNumber(value: number, formatOrig: string): string {

    var format: string = formatOrig

    // Handle percentage formatting
    if (formatOrig.includes('%')) {
      value = value * 100;
      format = formatOrig.replace('%', ''); // Remove % from format string
    }

    // Split format string into integer and decimal parts
    const [intPart, decimalPart] = format.split('.');

    // Format integer part
    // const intValue = Math.floor(value).toString();

    const intValue = Math.floor(value).toLocaleString();  // This adds comma separators for thousands
    const formattedIntPart = intPart.replace(/0+/g, (match) => {
      return intValue.padStart(match.length, '0');
    });

    // Format decimal part
    let formattedDecimalPart = '';
    if (decimalPart) {
      const decimalValue = value.toFixed(decimalPart.length).split('.')[1];
      formattedDecimalPart = '.' + decimalValue;
    }

    return formattedIntPart + formattedDecimalPart + (formatOrig.includes('%') ? '%' : '');
  }

  // function getColorFromRedToGreen(value: number): string {

  //   // Clamp the value between 0 and 1
  //   value = Math.pow(Math.max(0, Math.min(1, value)), 3 / 4);

  //   let red, green, blue: number;

  //   if (value <= 0.5) {
  //     // Transition from red to white
  //     red = 255;
  //     green = Math.round(255 * (2 * value));
  //     blue = Math.round(255 * (2 * value));
  //   } else {
  //     // Transition from white to green
  //     red = Math.round(255 * (2 * (1 - value)));
  //     green = 255;
  //     blue = Math.round(255 * (2 * (1 - value)));
  //   }

  //   // Convert to a hex string
  //   return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
  // }

  getColor(value: number | null, redGreen: boolean): string {
    // console.log('MapComponentComponent::getColor::value: ' + value)
    if (value === null) {
      return 'rgba(128, 128, 128, 0.2)'; // Light gray with 50% transparency
    }
    if (!redGreen) {
      return this.getColorFromRedToGreen(value);
    } else {
      return this.getColorFromCyanToDarkBlue(value);
    }
  }

  getColorFromRedToGreen(value: number): string {
    // Clamp the value between 0 and 1
    value = Math.max(0, Math.min(1, value));

    let red, green, blue: number;

    if (value <= 0.5) {
      // Transition from red to yellow
      red = 255;
      green = Math.round(255 * (2 * value)); // Green increases as value goes from 0 to 0.5
      blue = 0;
    } else {
      // Transition from yellow to a darker green
      red = Math.round(255 * (2 * (1 - value))); // Red decreases as value goes from 0.5 to 1
      green = Math.round(128 + 127 * (1 - value)); // Green goes from 255 to a darker green (about 128) as value approaches 1
      blue = 0;
    }

    // Convert to a hex string
    return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
  }

  getColorFromCyanToDarkBlue(value: number): string {
    // Clamp the value between 0 and 1
    value = Math.max(0, Math.min(1, value));

    // Red stays at 0
    const red = 0;

    // Green goes from a slightly reduced value of 180 (to be closer to blue) down to 0
    const green = Math.round(240 * (1 - value));

    // Blue remains fully saturated at 255
    const blue = 255;

    // Convert to a hex string
    return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
  }


}
