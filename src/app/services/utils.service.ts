import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  palettes = [
    { paletteId: 'redgreen', color1: '#ff0000', color2: '#ffff00', color3: '#008000' }, // Red-Green
    { paletteId: 'cyan', color1: '#00f0ff', color2: '#0078ff', color3: '#0000ff' }, // Cyan
    { paletteId: 'camber', color1: '#BED5D6', color2: '#7D8F7B', color3: '#5C6D4B' }, // Camber
    { paletteId: 'mono', color1: '#bbbbbb', color2: '#888888', color3: '#333333' }  // Monochrome
  ];

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

  getColor(value: number | null, paletteId: string): string {
    // console.log('MapComponentComponent::getColor::value: ' + value)
    if (value === null) {
      return 'rgba(128, 128, 128, 0.2)'; // Light gray with 50% transparency
    }

    const p = this.palettes.find(i => i.paletteId === paletteId) ?? {
      paletteId: 'default',
      color1: '#ffaaaa',
      color2: '#ffffaa',
      color3: '#aa80aa'
    }; // Default to Red-Yellow-Green


    return this.getInterpolatedColor(value, p.color1, p.color2, p.color3)

    // console.log("UtilsService::getColor::this.getColorFromRedToGreen(0.0): " + this.getColorFromRedToGreen(0.0))
    // console.log("UtilsService::getColor::this.getColorFromRedToGreen(0.5): " + this.getColorFromRedToGreen(0.5))
    // console.log("UtilsService::getColor::this.getColorFromRedToGreen(1.0): " + this.getColorFromRedToGreen(1.0))
    // console.log("UtilsService::getColor::this.getColorFromCyanToDarkBlue(0.0): " + this.getColorFromCyanToDarkBlue(0.0))
    // console.log("UtilsService::getColor::this.getColorFromCyanToDarkBlue(0.5): " + this.getColorFromCyanToDarkBlue(0.5))
    // console.log("UtilsService::getColor::this.getColorFromCyanToDarkBlue(1.0): " + this.getColorFromCyanToDarkBlue(1.0))

    // if (!redGreen) {
    //   return this.getColorFromRedToGreen(value);
    // } else {
    //   return this.getColorFromCyanToDarkBlue(value);
    // }
  }

  getInterpolatedColor(value: number, low_color: string, middle_color: string, high_color: string): string {
    // Clamp the value between 0 and 1
    value = Math.max(0, Math.min(1, value));

    // Convert hex colors to RGB
    const lowRGB = this.hexToRgb(low_color);
    const middleRGB = this.hexToRgb(middle_color);
    const highRGB = this.hexToRgb(high_color);

    let interpolatedRGB: { r: number; g: number; b: number };

    if (value <= 0.5) {
      // Interpolate between low_color and middle_color
      const factor = value * 2;
      interpolatedRGB = this.interpolateColors(lowRGB, middleRGB, factor);
    } else {
      // Interpolate between middle_color and high_color
      const factor = (value - 0.5) * 2;
      interpolatedRGB = this.interpolateColors(middleRGB, highRGB, factor);
    }

    // Convert back to hex and return
    return this.rgbToHex(interpolatedRGB);
  }

  // Convert hex string to RGB
  hexToRgb(hex: string): { r: number; g: number; b: number } {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b };
  }

  // Convert RGB to hex string
  rgbToHex(rgb: { r: number; g: number; b: number }): string {
    return `#${((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b).toString(16).slice(1)}`;
  }

  // Interpolate between two RGB colors
  interpolateColors(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }, factor: number): { r: number; g: number; b: number } {
    return {
      r: Math.round(color1.r + (color2.r - color1.r) * factor),
      g: Math.round(color1.g + (color2.g - color1.g) * factor),
      b: Math.round(color1.b + (color2.b - color1.b) * factor),
    };
  }



  // getColorFromRedToGreen(value: number): string {
  //   // Clamp the value between 0 and 1
  //   value = Math.max(0, Math.min(1, value));

  //   let red, green, blue: number;

  //   if (value <= 0.5) {
  //     // Transition from red to yellow
  //     red = 255;
  //     green = Math.round(255 * (2 * value)); // Green increases as value goes from 0 to 0.5
  //     blue = 0;
  //   } else {
  //     // Transition from yellow to a darker green
  //     red = Math.round(255 * (2 * (1 - value))); // Red decreases as value goes from 0.5 to 1
  //     green = Math.round(128 + 127 * (1 - value)); // Green goes from 255 to a darker green (about 128) as value approaches 1
  //     blue = 0;
  //   }

  //   // Convert to a hex string
  //   return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
  // }

  // getColorFromCyanToDarkBlue(value: number): string {
  //   // Clamp the value between 0 and 1
  //   value = Math.max(0, Math.min(1, value));

  //   // Red stays at 0
  //   const red = 0;

  //   // Green goes from a slightly reduced value of 180 (to be closer to blue) down to 0
  //   const green = Math.round(240 * (1 - value));

  //   // Blue remains fully saturated at 255
  //   const blue = 255;

  //   // Convert to a hex string
  //   return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
  // }


}
