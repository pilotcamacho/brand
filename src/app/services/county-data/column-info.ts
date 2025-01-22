import { Region } from "src/app/components/map-component/map-input";
import { ColumnData } from "./county-data-i";
import { DataRowByCounty } from "./county-info";


export class ColumnInfoByRegion {
    columnGroup: 'medicare'| 'rates'| 'commercial'| 'general';
    region: Region;
    code: keyof DataRowByCounty;
    name: string;
    formula: string;
    description: string;
    type: string;
    min: number;
    max: number;
    median: number;
    q1: number;
    q3: number;
    num_values: number;
    format: string;
    countiesInfo: { subRegion: string, value: (string | number | undefined) }[]

    constructor(
        columnGroup: 'medicare'| 'rates'| 'commercial'| 'general',
        region: Region,
        countyData: ColumnData,
        countiesInfo: DataRowByCounty[]
    ) {
        // console.log("ColumnInfo::constructor")
        this.columnGroup = columnGroup;
        this.region = region;
        this.code = countyData.code;
        this.name = countyData.name;
        this.formula = countyData.formula;
        this.description = countyData.description;
        this.type = countyData.type
        this.min = 1e9;
        this.max = -1e9;
        this.median = 0;
        this.q1 = 0;
        this.q3 = 0;
        this.num_values = 0;
        this.format = countyData.format;
        this.countiesInfo = countiesInfo.map(ci => ({ subRegion: ci.county_name, value: ci[countyData.code] }));
        this.updateMinMax()
    }

    updateMinMax() {
        // console.log("ColumnInfo::updateMinMax")
        const arr: number[] = []
        this.countiesInfo.forEach(county => {
            if (typeof county.value === 'number') {
                let v: number = (typeof county.value === 'number') ? Number(county.value) : 0;
                // console.log('ColumnInfo::updateMinMax::v:' + v)
                if (v !== Infinity) {
                    // console.log('ColumnInfo::updateMinMax::in if: v:' + v)
                    if (v < this.min) { this.min = v }
                    if (v > this.max) { this.max = v }
                    arr.push(v)
                }
            }
        });

        const { Q1, median, Q3, N } = this.getQuartiles(arr);  // Destructure into local variables

        // Now assign to `this` properties
        this.q1 = Q1;
        this.median = median;
        this.q3 = Q3;
        this.num_values = N;
    }

    getQuartiles(arr: number[]): { Q1: number, median: number, Q3: number, N: number } {
        // Sort the array in ascending order
        arr.sort((a, b) => a - b);

        const N = arr.length;

        // Helper function to calculate the median of a given array
        function medianOfArray(arr: number[]): number {
            const mid = Math.floor(arr.length / 2);
            return arr.length % 2 === 0
                ? (arr[mid - 1] + arr[mid]) / 2
                : arr[mid];
        }

        // Median (Q2)
        const median = medianOfArray(arr);

        // First quartile (Q1) - Median of the lower half
        const lowerHalf = arr.slice(0, Math.floor(N / 2));  // Lower half excludes the median if N is odd
        const Q1 = medianOfArray(lowerHalf);

        // Third quartile (Q3) - Median of the upper half
        const upperHalf = arr.slice(Math.ceil(N / 2));  // Upper half excludes the median if N is odd
        const Q3 = medianOfArray(upperHalf);

        return { Q1, median, Q3, N };
    }

}