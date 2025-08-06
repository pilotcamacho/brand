export interface Indicators {
    region: string;
    subRegion: string;
    columns: {
        col_title: string;
        rows: {
            code: string;
            title: string;
            value: number;
            valueOriginal: number;
            pColor: number;
            format: string;
            help: string;
        }[];
    }[];
}
