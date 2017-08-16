import { Component, ViewChild, Input} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Co } from '../../core/co';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls:['./error.component.css']
})

export class ErrorComponent{
  @ViewChild('errorModal') public errorModal:ModalDirective;
  co:Co;

  constructor() {};

  @Input('communicationObject')
  set communicationObject(co: Co) {
    this.co = co;
    if(this.co.err)
      this.errorModal.show();
    else
      this.errorModal.hide();
  }
}
