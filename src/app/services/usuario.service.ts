import { Injectable } from '@angular/core';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from 'aws-amplify/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticatorService } from '@aws-amplify/ui-angular';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private userSignedInSubject = new BehaviorSubject<boolean>(false); // true if user is signed in, false otherwise
  userSignedIn$: Observable<boolean> = this.userSignedInSubject.asObservable();

  user: any = null;
  usuarioId: string = '';
  email: string = '';
  isSignedIn: boolean = false;

  constructor() { }

  async updateUser(authStatus: string) {
    console.log('UsuarioService::updateUser::authenticator.authStatus:  ', JSON.stringify(authStatus));

    if (authStatus === "authenticated") {
      const u = await getCurrentUser()
      this.user = u;
      this.usuarioId = u.userId;
      this.email = this.user.signInDetails.loginId
      this.isSignedIn = true;
      this.userSignedInSubject.next(true);  // Emit signed-in event
      return;
    }
    // Only update to signed out if was not signed out. This is to prevent multiple calls when status is configuring.
    if (this.user !== null) {
      this.user = null;
      this.usuarioId = '';
      this.email = ''
      this.isSignedIn = false;
      this.userSignedInSubject.next(false);  // Emit signed-out event
    }
  }
}
