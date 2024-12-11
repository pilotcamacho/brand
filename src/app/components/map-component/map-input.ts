
export enum RegionType {
    COUNTRY = 'country',
    STATE = 'state'
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
}

export class MapInput {
    region: Region;         // Region information
    title: string;          // Title of the data
    data: DataPoint[];      // Array of data points
    isRedGreen: boolean;
    format: string;

    constructor(region: Region, title: string, data: DataPoint[], isRedGreen: boolean, format: string) {
        this.region = region;
        this.title = title;
        this.data = data;
        this.isRedGreen = isRedGreen;
        this.format = format;
    }
    /**
     * Get the minimum and maximum values from the data array
     * @returns A tuple with [min, max, formatted default]
     */
    min_and_max_values(): [number | null, number | null, string] {
        if (!this.data || this.data.length === 0) {
            return [null, null, '0'];
        }

        const values = this.data.map(dp => dp.value);
        const min = Math.min(...values);
        const max = Math.max(...values);

        return [min, max, this.format];
    }

    /**
     * Get the min and max values for a specific sub-region
     * @param subRegion - The name of the sub-region
     * @returns A tuple with [min, max, formatted default] for the sub-region
     */
    valuesFromSubRegionName(subRegion: string): [number | null, number | null, string] {
        if (!this.data || this.data.length === 0) {
            return [null, null, 'NA'];
        }

        const subRegionData = this.data.filter(dp => (dp.subRegion === subRegion));

        if (subRegionData.length === 0) {
            return [null, null, 'NA'];
        }

        const [min, max, format]: [number | null, number | null, string] = this.min_and_max_values();

        if (min === null || max === null) return [null, null, format];
        return [(subRegionData[0].value - min) / (max - min), subRegionData[0].value, format];
    }
}