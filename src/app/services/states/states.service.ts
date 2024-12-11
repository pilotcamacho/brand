import { Injectable } from '@angular/core';
import { STATES_DATA } from './states-data'
import { StateData } from './states-data-i';


@Injectable({
  providedIn: 'root'
})
export class StatesService {

  private data: StateData[] = STATES_DATA;

  constructor() { }

  /**
   * Retrieve state_code and state_fp by state_name
   * @param stateName - The name of the state
   * @returns Object with state_code and state_fp or null if not found
   */
  getStateDetailsByName(stateName: string): { state_code: string; state_fp: string } | null {
    const state = this.data.find(item => item.state_name.toLowerCase() === stateName.toLowerCase());
    if (state) {
      return { state_code: state.state_code, state_fp: state.state_fp };
    }
    return null; // Return null if state not found
  }
}
