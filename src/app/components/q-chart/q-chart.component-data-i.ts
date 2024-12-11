import { numberNull } from "src/app/services/rate-data/rate-data";

export interface qChartComponentDataI {
	lables: string[],
	// 			5%   		10%   		25%   		50%   		75%   		90%   		95%
	data: [numberNull, numberNull, numberNull, numberNull, numberNull, numberNull, numberNull][]
}