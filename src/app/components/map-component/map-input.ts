import { UtilsService } from "src/app/services/utils.service";

export enum RegionType {
    COUNTRY = 'country',
    STATE = 'state',
    COUNTY = 'county'
}

export interface Region {
    type: RegionType; // Enumerator: 'country' or 'state'
    name: string;     // Name of the region
    code: string;
    codeFP: string | null;
}

export interface DataPoint {
    subRegion: string; // Name of the subregion
    value: number;     // Numerical value
    quantiles: {
        min: number, q05: number, q10: number, q25: number, q50: number, q75: number, q90: number, q95: number, max: number,
        avg: number,
        change: number | null,
        myRate: number | null
    }
}

export class MapInput {
    region: Region;         // Region information
    title: string;          // Title of the data
    data: DataPoint[];      // Array of data points
    paletteId: string;
    format: string;
    isPercentage: boolean;

    constructor(region: Region, title: string, data: DataPoint[], paletteId: string, isPercentage: boolean
    ) {
        this.region = region;
        this.title = title;
        this.data = data;
        this.paletteId = paletteId;
        this.format = UtilsService.formatForDataset(data.map(dp => { return dp.value }));
        this.isPercentage = isPercentage;
    }
    /**
     * Get the minimum and maximum values from the data array
     * @returns A tuple with [min, max, formatted default, isPercentage]
     */
    min_max_format_values(): [number | null, number | null, string, boolean] {
        if (!this.data || this.data.length === 0) {
            return [null, null, 'KF1', false];
        }

        const values = this.data.map(dp => dp.value);
        const min = Math.min(...values);
        const max = Math.max(...values);

        if (min === max) {
            return [min - 1, max + 2, this.format, this.isPercentage];
        }
        return [min, max, this.format, this.isPercentage];
    }

    /**
     * Get the min and max values for a specific sub-region
     * @param subRegion - The name of the sub-region
     * @returns A tuple with [value_normalized_0_1, value, formatted default, isPercentage] for the sub-region
     */
    valuesFromSubRegionName(subRegion: string): [number | null, number | null, string, boolean] {
        if (!this.data || this.data.length === 0) {
            return [null, null, 'KF2', false];
        }

        const subRegionData = this.data.filter(dp => (dp.subRegion === subRegion));

        if (subRegionData.length === 0) {
            return [null, null, 'KF3', false];
        }

        const [min, max, format, isPercentage]: [number | null, number | null, string, boolean] = this.min_max_format_values();

        if (min === null || max === null) return [null, null, format, isPercentage];
        return [(subRegionData[0].value - min) / (max - min), subRegionData[0].value, format, isPercentage];
    }
}