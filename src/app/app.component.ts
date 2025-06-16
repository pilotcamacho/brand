import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonApp, IonRouterOutlet, IonButton } from '@ionic/angular/standalone';

import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { UsuarioService } from './services/usuario.service';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { getCurrentUser } from '@aws-amplify/auth';


Amplify.configure(
  {
    ...outputs,
    Auth: {
      Cognito: {
        identityPoolId: outputs.auth?.identity_pool_id,
        userPoolClientId: outputs.auth?.user_pool_client_id,
        userPoolId: outputs.auth?.user_pool_id,
        allowGuestAccess: true,
      },
    },
  }
);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public authenticator: AuthenticatorService,
    private userSrv: UsuarioService,
    private navCtrl: NavController
  ) {
    console.log('AppComponent::constructor()');

    // Amplify.configure(outputs);

    // this.authenticator.subscribe((state) => {
    //   console.log('AppComponent::constructor.subscribe::state: ', state);
    //   this.userSrv.updateUser(state.authStatus);
    // })
  }

  async ngOnInit() {
    console.log('AppComponent::ngOnInit()');
    // try {
    //   const user = await getCurrentUser();
    //   console.log('AppComponent::user: ', user);
    //   this.userSrv.updateUser('authenticated');
    //   this.navCtrl.navigateRoot('/home');

    // } catch {
    //   this.userSrv.updateUser('notAuthenticated');
    //   // this.navCtrl.navigateRoot('/authentication'); // or login
    //   this.navCtrl.navigateRoot('/home'); // or login
    // }
  }
}
