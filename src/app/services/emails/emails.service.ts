import { Injectable } from '@angular/core';
import { EMAILS } from './emails-list';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {


  emailSet = new Set(EMAILS);

  constructor() { }

  isEmailAuthorized(email: string): boolean {
    return this.emailSet.has(email.trim().toLowerCase());
  }

}
