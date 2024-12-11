import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButton } from '@ionic/angular/standalone';

import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { UsuarioService } from './services/usuario.service';
import { AuthenticatorService } from '@aws-amplify/ui-angular';


Amplify.configure(outputs)


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public authenticator: AuthenticatorService,
    private userSrv: UsuarioService
  ) {
    Amplify.configure(outputs);
    this.authenticator.subscribe((state) => {
      console.log('AppComponent::constructor.subscribe::state: ', state);
      this.userSrv.updateUser(state.authStatus);
    })
  }
}
