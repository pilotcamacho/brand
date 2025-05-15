import { Component, Input, OnInit } from '@angular/core';
// import { IonButton } from '@ionic/angular/standalone';
import { IonicModule, PopoverController } from '@ionic/angular';



@Component({
  selector: 'app-help-popover',
  templateUrl: './help-popover.component.html',
  styleUrls: ['./help-popover.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class HelpPopoverComponent implements OnInit {
  @Input() helpText: string;
  @Input() helpLink: string;

  constructor(private popoverCtrl: PopoverController) {
    this.helpText = 'helpText'
    this.helpLink = 'helpLink'
  }

  ngOnInit() {
    console.log("HelpPopoverComponent")
  }

  goToReference() {
    window.open(this.helpLink, '_blank');
    this.popoverCtrl.dismiss();
  }

  close(data: any) {
    this.popoverCtrl.dismiss(data);
  }

}
